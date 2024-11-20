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
    }
  },
  fields: [
    { name: 'headline', type: 'text', 
        required: true },
    { name: 'description', type: 'text', 
        required: true },
    { name: 'for', type: 'radio', 
        options: [
            'him', 'her'
        ]
    },
    { name: 'category', type: 'select', 
      options: [
        'cute',
        'familyOriented',
        'fun',
        'relaxing',
        'spicy'
      ]
    },
    { name: 'createdBy', type: 'relationship',
      relationTo: 'users',
      access: {
        read: ({req: {user}}) => { return user && (user.role == 'admin')},
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
