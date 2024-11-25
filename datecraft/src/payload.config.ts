import path from 'path'

import { payloadCloud } from '@payloadcms/plugin-cloud'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { slateEditor } from '@payloadcms/richtext-slate'
import { buildConfig } from 'payload/config'

import Citas from './collections/Citas'
import Relaciones from './collections/Relaciones'
import Users from './collections/Users'
import Wishes from './collections/Wishes'

export default buildConfig({
  admin: {
    user: Users.slug,
    avatar: 'gravatar',
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  collections: [Citas, Relaciones, Users, Wishes],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [payloadCloud()],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
})
