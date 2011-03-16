mongee
======

## What is mongee?

mongee is a simple social network built with node.js and
MongoDB. 

It is thought that it could be run on an own server, for 
example in the office.

## Setup

Do the following to run mongee on your own server:

1. Install node.js (http://www.nodejs.org)
2. Install MongoDB (http://mongodb.org)
3. Create a new directory for node and clone the source: 
   `git clone git@github.com:MaxGfeller/mongee.git`

## Interfaces

mongee is completely RESTful and the client side implementation 
can be replaced. 

To see which interfaces are implemented, take a look at:
`http://localhost:3000/show_available_interfaces`

## Authentication

The most requests above require an authentication, therefore a 
`authorization` header must be set in the request. 

This is a basic authorization and includes the string 
`Basic user_id:user_password`.

