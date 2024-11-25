import { CollectionConfig } from 'payload/types'

const Wishes: CollectionConfig = {
  slug: 'wishes',
  admin: {
    useAsTitle: 'headline',
  },
  access: {
    read: ({req: {user}}) => {
      if (!user) { return false }
      return { 
        createdBy: {
          equals: user.id
        }
      }
    },
    create: async ({req: {user}, req: {payload}}) => {
      if (!user) { return false }
      let citas = await payload.find({
        collection: 'citas',
        limit: 1,
        where: {
          participants: {
            contains: user.id
          }
        }
      })
      console.log('citas totalDocs', citas.totalDocs)
      if (citas.totalDocs <= 0) {
        return false
      }
      return { 
        and: [
          {
            createdBy: {
              equals: user.id
            }
          },
          {

          }
        ]
      }
    }
  },
  fields: [
    { name: 'headline', type: 'text', 
        required: true },
    { name: 'description', type: 'text', 
        required: true },
    { name: 'for', type: 'radio', 
        options: [
            'him', 'her', 'him/her'
        ]
    },
    { name: 'category', type: 'select', 
      options: [
        'cute',
        'educational',
        'fun',
        'nasty', 
        'relaxing',
        'romantic',
        'intimate',
        'spiritual'
      ]
    },
    { name: 'createdBy', type: 'relationship',
      relationTo: 'users',
      access: {
        read: ({req: {user}}) => { 
          return user && (user.role == 'admin')
        },
        update: () => false
      },
      admin: {
        readOnly: true,
        condition: data => Boolean(data?.createdBy)
      },
    }
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        if (operation === 'create') {
            if (req.user) {
                data.createdBy = req.user.id;
                return data;
            }
        }
      }
    ]
  }
}

export default Wishes
