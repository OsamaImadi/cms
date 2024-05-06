
## Description

Simple Content Management System with users and Admin. 
The postman documentation can be accessed here (https://documenter.getpostman.com/view/8516302/2sA3JGgQ6n) as well as a JSON of the documentation is also present in the root folder.
Following is the way to run the application. Please note you need to have NodeJs(https://nodejs.org/en) and NestJs(https://nestjs.com/) installed to run this application.

## Installation

```bash
$ npm install
```

Please set the .env file as follows.

```
DATABASE_HOST=<<db host>>
DATABASE_PASSWORD=<<db password>>
DATABASE_USERNAME=<<db username>>
DATABASE_NAME=<db name>
AWS_BUCKET_NAME=<<s3 bucket name>>
AWS_BUCKET_LOCATION=<<s3 bucket location>>
AWS_ACCESS_KEY=<<s3 access key>>
AWS_SECRET_KEY=<<s3 secret keu>>
JWT_SECRET=<<jwt_secret>>
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```