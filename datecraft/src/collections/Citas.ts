import { CollectionConfig } from 'payload/types'

const Citas: CollectionConfig = {
  slug: 'citas',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    create: ({req: {user}}) => {
      if (!user) { return false }
      return user.relacion && user.relacion.length > 1 ? true : false 
    }
  },
  fields: [
    { name: 'confirmedBy', type: 'relationship', 
      hasMany: true, 
      relationTo: 'users',
      admin: {
        hidden: true
      }
    },
    { name: 'createdBy', type: 'relationship',
      relationTo: 'users',
      access: {
        update: () => false
      },
      admin: {
        readOnly: true,
        condition: data => Boolean(data?.createdBy)
      },
    },
    { name: 'endDate', type: 'date' },
    { name: 'participants', type: 'relationship', 
      relationTo: 'users', 
      hasMany: true,
      filterOptions: ( { user } ) => {
        if (user.relacion instanceof Array) {
          let relIds = user.relacion.map((u) => {
            return u.id
          })
          
          return {
            and: [ 
              {
                id: {
                  not_equals: user?.id
                }
              },
              {
                id: {
                  in: relIds
                }
              }
            ]
          }
        }
       
      }
    },
    { name: 'startDate', type: 'date' },
    { name: 'title', type: 'text', required: true }, 
    { name: 'wishes', type: 'relationship', 
      hasMany: true, 
      relationTo: 'wishes'
    }
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req: { user } }) => {
        
        if (data.participants.length <= 0) {
          throw new Error()
        }
        
        if (operation === 'create') {
          if (user) {
            data.createdBy = user.id;
          }
        }
      }
    ]
  }
}

export default Citas
