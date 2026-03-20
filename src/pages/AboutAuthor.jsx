import { Title, Text, Stack, Paper } from '@mantine/core';

function AboutAuthor() {
  return (
    <Stack gap="xl" py="xl" maw={750} mx="auto">
      <Title
        order={1}
        ta="center"
        style={{ color: 'var(--mantine-color-brown-8)' }}
      >
        About the Author
      </Title>

      <Paper
        shadow="sm"
        radius="md"
        p="xl"
        style={{
          backgroundColor: 'var(--mantine-color-brown-0)',
          border: '2px solid var(--mantine-color-brown-3)',
        }}
      >
        <Stack gap="md">
          <Text size="lg">
            Hello, I am <strong>Nilora Takia</strong>, and I know the name is a
            little strange to most bipeds but to us quadrupeds, I assure you it
            is really quite common.
          </Text>

          <Text size="lg">
            I am an aspiring author embarking on a book for little humans about
            Australian Possums. You may be thinking, &ldquo;Why would a dog want
            to write a book about possums?&rdquo; That is a very good question
            as my affinity for marsupials has been less than flattering. There is
            one in particular that is always intruding into my property, and no
            matter how much I fuss, she continues to do so. Oh how I wish I
            could just get one bite in&hellip; So why then do I embark on writing
            a book upon the very target of my disdain?
          </Text>

          <Text
            ta="center"
            fs="italic"
            c="dimmed"
            size="sm"
          >
            Sweetheart with Daddy
          </Text>

          <Text size="lg">
            Well, it is really quite simple: My two pets Daddy (he&rsquo;s the
            bigger one) and Sweetheart (she&rsquo;s the smaller one) were
            exploring a site about their ancestry when they were examining a
            newspaper written in the 19th century about a railroad robbery gone
            awry in the wild west &mdash; California to be exact. It seemed that
            neither conductor nor passengers had even realized that an infamous
            band of bandits had boarded the &ldquo;iron bronco&rdquo;, all
            because the perilous plot had gone plop even before the perpetrators
            had been perceived.
          </Text>

          <Text size="lg">
            How could that be? It was right then that I noticed something out of
            place in the granulated black and white photo taken at the scene, or
            rather <em>someone</em> out of place. It was a white lemur possum. I
            had to look twice to be sure because I had first assumed it was just
            a funny looking feline. But no, there stood a rare white{' '}
            <em>Hemibelideus Lemuroides</em>. I was flabbergasted. What was an
            Australian possum doing in the Southwest United States in the 19th
            century?
          </Text>

          <Text size="lg">
            After a bit of research I stumbled upon the legend of{' '}
            <strong>The Awesome Aussie Possum Posse</strong>. It seems that a
            small band of Australian possums helped shape the Wild West by saving
            it from an ungracious and greedy gang of goons that had all but
            conquered it. Their story was so compelling&hellip; so inspiring, I
            wondered why I hadn&rsquo;t heard of them before. I plan to right
            this egregious historical oversight by writing a glorious historical
            overture to tell the world about those marvelous marsupial
            mavericks.
          </Text>

          <Text
            size="lg"
            ta="right"
            fs="italic"
            mt="md"
            style={{ color: 'var(--mantine-color-brown-7)' }}
          >
            Yours truly, Nilora
          </Text>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default AboutAuthor;
