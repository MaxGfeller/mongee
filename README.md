mongee
======

## What is mongee?

mongee is a simple social network built with node.js and
MongoDB. 

It is thought that it could be run on an own server, for 
example in the office.

## Interfaces

mongee is completely RESTful and the client side implementation 
can be replaced. 

The following are the defined interfaces:

`/user/new/:user_mail__64/:user_prename/:user_password/:user_birthday?`
returns a JSON object of the user if everything was ok

`/user/get/:user_id`
returns a JSON object of the user, if not found a 404

`/user/update/&attribute:value&second_attribute:other_value`
returns a JSON of the updated user

`/user/delete`
returns a 200 if ok

`/user/sign_in/:user_mail__64/:user_password`
returns a JSON object of the user, if the credentials were not ok a 403

`/post/new/:type_of_post/:walls/:post_content`
returns a JSON object of the post     type_of_post(1:TextStatus | 2:Link | 3:PhotoAlbum | 4:SinglePhoto)

`/post/add_comment/:post_id/:comment`
returns a JSON object of the post

`/post/delete/:post_id`
returns a 200 if successful

`/photo/gallery/add/:gallery_name/:gallery_description?`
returns a JSON object of the photo albums

`/photo/gallery/update/:gallery_id/:gallery_description`
returns a JSON object of the photo albums

`/photo/gallery/delete/:gallery_id`
returns a JSON object of the photo albums

If an argument is followed by `__64` it means that the value has 
to be base64 encoded. 

## Authentication

The most requests above require an authentication, therefore a 
`authorization` header must be set in the request. 

This is a basic authorization and includes the string 
`Basic user_id:user_password`.

