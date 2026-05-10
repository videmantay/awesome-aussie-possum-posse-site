import { useState, useRef, useEffect } from 'react';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { Image as TiptapImage } from '@tiptap/extension-image';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button, Group, Loader, Modal, Stack, Text } from '@mantine/core';
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../firebase';

// ─── Style helpers ────────────────────────────────────────────────────────────

// Generates the inline style saved into the HTML (Firestore body, exports, email)
function buildImageStyle(width, align, wrap) {
  const parts = ['max-width:100%'];
  if (width) parts.push(`width:${width}px`);

  if (align === 'left' && wrap) {
    parts.push('float:left', 'margin:0 1em 0.5em 0', 'display:block');
  } else if (align === 'right' && wrap) {
    parts.push('float:right', 'margin:0 0 0.5em 1em', 'display:block');
  } else if (align === 'left') {
    parts.push('display:block', 'margin-right:auto', 'margin-left:0');
  } else if (align === 'right') {
    parts.push('display:block', 'margin-left:auto', 'margin-right:0');
  } else {
    parts.push('display:block', 'margin:0 auto');
  }
  return parts.join('; ');
}

// Visual styles for the NodeViewWrapper in the editor
function getWrapperStyle(align, wrap, width) {
  const w = width ? `${width}px` : undefined;
  if (wrap && align === 'left')  return { float: 'left',  width: w || 'auto', maxWidth: '60%', marginRight: '1em', marginBottom: '0.5em' };
  if (wrap && align === 'right') return { float: 'right', width: w || 'auto', maxWidth: '60%', marginLeft:  '1em', marginBottom: '0.5em' };
  if (align === 'left')  return { display: 'block', width: w || '100%', maxWidth: '100%', marginLeft: 0,      marginRight: 'auto' };
  if (align === 'right') return { display: 'block', width: w || '100%', maxWidth: '100%', marginLeft: 'auto', marginRight: 0 };
  return { display: 'block', width: w || '100%', maxWidth: '100%', marginLeft: 'auto', marginRight: 'auto' };
}

// ─── Canvas crop helper ───────────────────────────────────────────────────────

async function cropToBlob(imgEl, pixelCrop) {
  const canvas = document.createElement('canvas');
  canvas.width  = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');
  const scaleX = imgEl.naturalWidth  / imgEl.width;
  const scaleY = imgEl.naturalHeight / imgEl.height;
  ctx.drawImage(
    imgEl,
    pixelCrop.x * scaleX, pixelCrop.y * scaleY,
    pixelCrop.width * scaleX, pixelCrop.height * scaleY,
    0, 0, pixelCrop.width, pixelCrop.height,
  );
  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.92));
}

// ─── Crop Modal ───────────────────────────────────────────────────────────────

function CropModal({ src, postId, onClose, onCropped }) {
  const imgRef = useRef(null);
  const [blobSrc, setBlobSrc]           = useState(null);
  const [crop, setCrop]                 = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [uploading, setUploading]       = useState(false);
  const [error, setError]               = useState(null);

  useEffect(() => {
    let objectUrl;
    fetch(src)
      .then(r => r.blob())
      .then(blob => { objectUrl = URL.createObjectURL(blob); setBlobSrc(objectUrl); })
      .catch(() => setError('Could not load image for cropping.'));
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [src]);

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerCrop(makeAspectCrop({ unit: '%', width: 80 }, undefined, width, height), width, height));
  }

  async function handleApply() {
    if (!completedCrop || !imgRef.current) return;
    setUploading(true);
    setError(null);
    try {
      const blob   = await cropToBlob(imgRef.current, completedCrop);
      const fileRef = storageRef(storage, `posts/${postId}/crop_${Date.now()}.jpg`);
      const task   = uploadBytesResumable(fileRef, blob, { contentType: 'image/jpeg' });
      await new Promise((resolve, reject) => task.on('state_changed', null, reject, resolve));
      onCropped(await getDownloadURL(task.snapshot.ref));
      onClose();
    } catch (err) {
      setError(err?.message || 'Crop upload failed.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <Modal opened onClose={onClose} title="Crop Image" size="xl" centered
      styles={{ title: { fontFamily: '"Bangers", cursive', letterSpacing: '1px', fontSize: '1.3rem', color: 'var(--mantine-color-brown-8)' } }}>
      <Stack gap="md">
        {error    && <Text size="sm" c="red" style={{ fontFamily: '"Patrick Hand", cursive' }}>{error}</Text>}
        {!blobSrc && !error && <Group justify="center" py="xl"><Loader color="brown" /></Group>}
        {blobSrc  && (
          <div style={{ maxHeight: '60vh', overflow: 'auto', background: '#f5f5f5', borderRadius: 8, padding: 8 }}>
            <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={c => setCompletedCrop(c)}>
              <img ref={imgRef} src={blobSrc} onLoad={onImageLoad} style={{ maxWidth: '100%', display: 'block' }} />
            </ReactCrop>
          </div>
        )}
        <Text size="xs" c="brown.4" style={{ fontFamily: '"Patrick Hand", cursive' }}>
          Drag to select the area to keep. The cropped image will be saved as a new file.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" color="brown" onClick={onClose} style={{ fontFamily: '"Baloo 2", sans-serif' }}>Cancel</Button>
          <Button loading={uploading} disabled={!completedCrop || !blobSrc} onClick={handleApply}
            style={{ background: '#3a1e00', color: '#fdf4eb', fontFamily: '"Bangers", cursive', fontSize: '1.1rem', letterSpacing: '1px', borderRadius: 20 }}>
            Apply Crop
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

// ─── Node View ────────────────────────────────────────────────────────────────

function ImageNodeView({ node, updateAttributes, selected, extension, deleteNode }) {
  const { src, alt, width, align = 'center', wrap = false } = node.attrs;
  const postId = extension.options.postId;
  const wrapperRef = useRef(null);
  const startXRef  = useRef(null);
  const startWRef  = useRef(null);
  const [cropOpen, setCropOpen] = useState(false);

  function onResizeMouseDown(e) {
    e.preventDefault();
    startXRef.current = e.clientX;
    startWRef.current = wrapperRef.current?.offsetWidth || 300;
    function onMove(e) {
      updateAttributes({ width: Math.max(80, Math.round(startWRef.current + (e.clientX - startXRef.current))) });
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  const canWrap = align === 'left' || align === 'right';

  return (
    <NodeViewWrapper style={getWrapperStyle(align, wrap, width)}>
      <div
        ref={wrapperRef}
        style={{
          position: 'relative',
          width: '100%',
          outline: selected ? '2px solid #c45a1a' : '2px solid transparent',
          borderRadius: 4,
          transition: 'outline-color 0.15s',
        }}
      >
        <img src={src} alt={alt || ''} draggable={false}
          style={{ width: '100%', display: 'block', borderRadius: 4 }} />

        {selected && (
          <>
            {/* Floating toolbar */}
            <div style={{
              position: 'absolute', top: -42, left: 0,
              background: '#3a1e00', borderRadius: 8,
              padding: '4px 8px',
              display: 'flex', alignItems: 'center', gap: 6,
              zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
              whiteSpace: 'nowrap',
            }}>
              {/* Size */}
              <span style={{ fontFamily: '"Patrick Hand", cursive', color: '#f5c87a', fontSize: '0.7rem' }}>
                {width ? `${width}px` : 'full'}
              </span>

              <Divider />

              {/* Alignment */}
              {['left', 'center', 'right'].map(a => (
                <TBtn
                  key={a}
                  active={align === a}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => {
                    const attrs = { align: a, wrap: a === 'center' ? false : wrap };
                    if ((a === 'left' || a === 'right') && !width) attrs.width = 300;
                    updateAttributes(attrs);
                  }}
                  title={`Align ${a}`}
                >
                  {a === 'left' ? '◀' : a === 'center' ? '▬' : '▶'}
                </TBtn>
              ))}

              <Divider />

              {/* Wrap toggle — only for left/right */}
              <TBtn
                active={wrap && canWrap}
                disabled={!canWrap}
                onMouseDown={e => e.preventDefault()}
                onClick={() => canWrap && updateAttributes({ wrap: !wrap })}
                title={canWrap ? (wrap ? 'Remove text wrap' : 'Wrap text around image') : 'Select left or right alignment to enable wrap'}
              >
                ↩ Wrap
              </TBtn>

              <Divider />

              {/* Crop */}
              <TBtn onMouseDown={e => e.preventDefault()} onClick={() => setCropOpen(true)} title="Crop">
                ✂
              </TBtn>

              {/* Full width reset */}
              {width && (
                <TBtn
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => updateAttributes({ width: null })}
                  title="Reset to full width"
                >
                  ↔
                </TBtn>
              )}
            </div>

            {/* SE resize handle */}
            <div onMouseDown={onResizeMouseDown} title="Drag to resize"
              style={{
                position: 'absolute', right: -6, bottom: -6,
                width: 14, height: 14,
                background: '#c45a1a', border: '2px solid #fff',
                borderRadius: 3, cursor: 'se-resize', zIndex: 10,
              }}
            />
          </>
        )}
      </div>

      {cropOpen && (
        <CropModal src={src} postId={postId}
          onClose={() => setCropOpen(false)}
          onCropped={newSrc => updateAttributes({ src: newSrc })}
        />
      )}
    </NodeViewWrapper>
  );
}

// ─── Toolbar sub-components ───────────────────────────────────────────────────

function TBtn({ active, disabled, title, onMouseDown, onClick, children }) {
  return (
    <button
      onMouseDown={onMouseDown}
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        background: active ? '#c45a1a' : 'transparent',
        color: disabled ? 'rgba(245,200,122,0.3)' : '#f5c87a',
        border: active ? 'none' : '1px solid rgba(245,200,122,0.3)',
        borderRadius: 5,
        padding: '2px 7px',
        fontFamily: '"Baloo 2", sans-serif',
        fontSize: '0.72rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        lineHeight: 1.4,
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span style={{ width: 1, height: 14, background: 'rgba(245,200,122,0.25)', display: 'inline-block' }} />;
}

// ─── Extension ────────────────────────────────────────────────────────────────

export const ResizableImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: el => parseInt(el.style.width) || parseInt(el.getAttribute('width')) || null,
        renderHTML: () => ({}), // handled in node renderHTML below
      },
      align: {
        default: 'center',
        parseHTML: el => el.getAttribute('data-align') || 'center',
        renderHTML: () => ({}),
      },
      wrap: {
        default: false,
        parseHTML: el => el.getAttribute('data-wrap') === 'true',
        renderHTML: () => ({}),
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const { width, align, wrap } = node.attrs;
    return ['img', {
      ...HTMLAttributes,
      'data-align': align,
      'data-wrap': wrap ? 'true' : undefined,
      style: buildImageStyle(width, align, wrap),
    }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
