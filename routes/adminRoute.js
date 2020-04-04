const AdminBro = require('admin-bro'),
    adminBroExpress = require('admin-bro-expressjs'),
    adminBroMongoose = require('admin-bro-mongoose'),
    Book = require('../models/BookModel'),
    User = require('../models/UserModel'),
    Lending = require('../models/LendingModel'),
    express = require('express');

AdminBro.registerAdapter(adminBroMongoose);


const adminBro = new AdminBro({
        resources: [
            {
            resource: Book,
                options: {
                    listProperties: [
                        "title",
                        "author",
                        "genre"
                    ]
                }
            },
            {
                resource:User,
            },
            {
                resource:Lending,
            }
        ],
        softwareBrothers: false,
        branding: {
            companyName: 'LenderReader'
        },
    }
);

// const router = adminBroExpress.buildRouter(adminBro);
// module.exports = router;

var adminRouter = express.Router();
const Admin = {
    email: process.env.EMAIL_OF_ADMIN || 'example@lendread.com',
    password: process.env.PASSWORD_OF_ADMIN || 'reading'
};

adminBroExpress.buildAuthenticatedRouter(
    adminBro,
    {
        authenticate: async (email, password) => {
            if (email === Admin.email && password === Admin.password) {
                return Admin
            }
            return null
        },
        cookieName: process.env.COOKIE_ADMIN_NAME || 'LR',
        cookiePassword: process.env.COOKIE_ADMIN_PASSWORD || 'admin-bro',
    },
    adminRouter,
    {
        resave: true,
        saveUninitialized: true
    }
);
module.exports = adminRouter;
