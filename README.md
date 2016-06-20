# crdt_tree
This is a CRDT string that's represented by a Binary Tree.

Rather than the WOOT approach to CRDT (With Out Operational Transformations) in which every character has it's own ID this approach only splits the string as required for the CRDT operation. Therefore, while it will grow without bounds if not managed properly it also starts at a much lower baseline of memory.

It's a binary tree and so we start by splitting the string in two.

If we have a string: `Hello World!` 

We end up with two nodes "Hello " and "World!"

If we add an element "X" into position 3 then we get:

{ { "Hel" , "X" } , "lo " } , "World!" 

Where the items within squigly brackets are sub nodes off the root.

Crucially, the point of this type of CRDT is to have a unique ID per character. I previously built the WOOT implementation which explicity wraps each character in an object and provides an ID field, for this approach I'm not doing that. So how do I have a unique ID per character if we just start with the string? Well the unique ID is actually the string offset. The idea being that the offset is persistant for the life of the CRDT object. 

Now you might be thinking that the offset of the string will change as you insert items into it, well yes and no. Of course the offset changes but as we split a string to insert an item in between it we embed the ID into the string, the inserted item is then inserted as a offset.

So we end up wiht:
`{ id : 0 , str : 'Hello World!' }`
If we split it then we get:
`{ id : 0 , str : 'Hello ' } , { id : 7 , str : 'World!' }`
if we insert an item at position 3 then we get
`{ id : 0 , str : 'Hel' } , { id : 3.5 , str : "X"} , { id : 4 , str : "lo "} , { id : 7 , str : 'World!' }`

So the id is actually the mid point between the two strings `((4 - (0 + 'Hel'.length())) / 2)`. If we add another letter we get:
`{ id : 0 , str : 'Hel' } , { id : 3.5 , str : "X"}  , { id : 3.75 , str : "Y"} , { id : 4 , str : "lo "}...`
And another: 
`{ id : 0 , str : 'Hel' } , { id : 3.5 , str : "X"}  , { id : 3.75 , str : "Y"} , { id : 3.88 , str : "Z"} , { id : 4 , str : "lo "}...`

Etc.

If two items come with the same id then order is done via a timestamp. It's best to try and preserve intention whenever possible, however it's also best to err on the side of caution. The most important thing is that each user sees the same content and therefore can fix the issue.