<template>
  <div class="parent">
    <NuxtPwaManifest />
    <NuxtPage />
  </div>
</template>

<script lang="ts" setup>
import { PGlite } from '@electric-sql/pglite'
import { providePGlite } from '@electric-sql/pglite-vue'

// const db = new PGlite()
// providePGlite(db)

// await db.exec(`
//   CREATE TABLE IF NOT EXISTS todo (
//     id SERIAL PRIMARY KEY,
//     task TEXT,
//     done BOOLEAN DEFAULT false
//   );
//   INSERT INTO todo (task, done) VALUES ('Install PGlite from NPM', true);
//   INSERT INTO todo (task, done) VALUES ('Load PGlite', true);
//   INSERT INTO todo (task, done) VALUES ('Create a table', true);
//   INSERT INTO todo (task, done) VALUES ('Insert some data', true);
//   INSERT INTO todo (task) VALUES ('Update a task');
// `)

// const data = await db.exec(`
// SELECT * FROM todo
// `
// )

// console.log(data)



</script>


<style lang="scss">
.parent {
  padding: 2rem;
  display: flex;
  position: absolute;
  inset: 0;
  justify-content: center;
  align-items: start;
}
</style>