import { CollectionConfig } from 'payload/types'
import AccessControl from '../utils/accessControl'
import userModel from '../models/user'

const Relaciones: CollectionConfig = {
    slug: 'relaciones',
    admin: {
        useAsTitle: 'title',
    },
    access: {
        create: async ({ req: { user }, req: { payload }, data: { loves } }) => {
            // Anyone logged in can create Relaciones
            if (!user) { return false }

            return true
        },
        read: async ({ req: { user }, req: { payload } }) => {
            if (!user) { return false }
            if (user.role == 'admin') { return true }
            let love  = await userModel.toLove(payload, user)
            
            return {
                loves: {
                    contains: love['id']
                }
            };
        },
        update: AccessControl.isAdminDevOrSelf,
        delete: AccessControl.isAdminDevOrSelf
    },
    fields: [
        { name: 'title', type: 'text', 
            required: true,
            unique: true
        },
        { name: 'loves', type: 'relationship', 
            label: 'Loves', 
            relationTo: 'loves', 
            hasMany: true, 
            required: true,
            unique: true
        }
    ],
    hooks: {
        beforeChange: [
            async ({ operation, req: { user }, req: {payload}, data}) => {
                if (!user) { throw new Error('User not logged in')}
                
                if (operation == 'create') {
                    console.log('getting relaciones for any of these', data.loves)
                    
                    let orQuery = []
                    data.loves.forEach(love => {
                        orQuery.push(
                            { 
                                loves: {
                                    contains: love
                                }
                            }
                        )
                    });
                    let committed = await payload.find({
                        collection: 'relaciones',
                        where: {
                            or: orQuery
                        }
                    })
                    console.log('committed', committed?.docs)
                    if (committed?.docs?.length > 0) {
                        throw new Error('Love in new Relacion is already committed.')
                    }
                }
                return data
            }
        ]
    }
}

export default Relaciones
