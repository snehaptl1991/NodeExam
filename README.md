Following steps are there to setup this project

You can setup the project from here
https://github.com/snehaptl1991/NodeExam
gh repo clone snehaptl1991/NodeExam

To setup this project following modules are required
express, express-validator, bcrypt, sequelize, multer, jsonwebtoken

Create database "nodeExam" and then run "npx sequelize-cli db:migrate", It will generate the db in your system

Need to setup your database details here
config/config.json

==============================================================================

First api is for register without authenticate

POST - http://localhost:5006/api/auth/register
Here Address and ProfileImage are optional so you may skip it

Sample data for this api is
Name:Sneha
Email:sss@gmail.com
Password:123Abc%456
PhoneNumber:9012345678
Gender:M
Address:123 ABC Mall
ProfileImage: Any jpg/png file

==============================================================================

Second api is for login 

POST - http://localhost:5006/api/auth/login

Sample data for this api is
Email:sss@gmail.com
Password:123Abc%456

This api returns token so need to copy it and then pass it to the api or in parent folder as "Bearer Token"

==============================================================================

Third api is for list customer data, Authentication required

GET - http://localhost:5006/api/customers/

Sample data for this api is
Name:Sneha
Email:sneha@gmail.com
page:1

page parameter is for pagination, Name and Email are optional, its for searching data, Here for now limit set to 5

==============================================================================

Fourth api is retriving particular customer data according to the Id, Authentication required

http://localhost:5006/api/customers/1

==============================================================================

Fifth api is Creating a New Customer, Authentication required

POST - http://localhost:5006/api/customers/

Name:Sneha
Email:ccc@gmail.com
Password:123Abc%456
PhoneNumber:9012345678
Gender:F
Address:123 ABC Mall
ProfileImage: Any jpg/png file

Here Address and ProfileImage are optional so you may skip it

==============================================================================

Sixth api is Updating an Existing Customer, Authentication required

PUT - http://localhost:5006/api/customers/1

Name:Sneha
Email:sneha@gmail.com
Password:123Abc%456
PhoneNumber:5345345534
Gender:F
Address:123 ABC Mall
ProfileImage: Any jpg/png file

Here customer is edited. So Id is passed in url and data whichever passed in the api that will be updated

==============================================================================

Seventh api is deleting customer, Authentication required

DELETE - http://localhost:5006/api/customers/5

Delete the customer which is passed Id in the url
