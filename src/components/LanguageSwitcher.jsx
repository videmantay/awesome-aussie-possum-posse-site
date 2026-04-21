import { Select } from '@mantine/core';
import { useTranslation } from 'react-i18next';

const languages = [
  { value: 'en',    label: '🇺🇸 English'   },
  { value: 'es-MX', label: '🇲🇽 Español'   },
  { value: 'pt-BR', label: '🇧🇷 Português' },
];

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <Select
      data={languages}
      value={i18n.language}
      onChange={(value) => i18n.changeLanguage(value)}
      size="xs"
      w={150}
      styles={{
        input: {
          backgroundColor: 'var(--mantine-color-brown-8)',
          color: '#f3e4d2',
          border: '1px solid var(--mantine-color-brown-5)',
        },
        dropdown: {
          backgroundColor: 'var(--mantine-color-brown-8)',
          border: '1px solid var(--mantine-color-brown-5)',
        },
        option: {
          color: '#f3e4d2',
          '&[data-combobox-selected]': {
            backgroundColor: 'var(--mantine-color-brown-6)',
          },
          '&:hover': {
            backgroundColor: 'var(--mantine-color-brown-6)',
          },
        },
      }}
    />
  );
}

export default LanguageSwitcher;
