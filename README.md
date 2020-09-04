# tripleBOT

tripleBOT is a Discord utility bot written in Javascript using Node.js, DynamoDB, and Express with the purpose of delegating manual actions away from the user and to automate otherwise tedious tasks through the use of the Discord and Twitch APIs. 

### Problem

Administrators manually update hundreds of user's roles manually while crossreferencing which role the specific user should receive by referenced multiple sources.

### Solution

 I took on the role of developing a bot that stores all necessary information that is referenced in a database associated with its respective user and references it on a set interval while checking if any updates should be made to the user's "ego" role automatically.

### Motivation

As a person whose primary form of communication is done through Discord, I've found myself wishing that the community I interact with most utilized a Discord bot to its advantage. Since this community doesn't utilize the features that a Discord bot could offer, I decided to create my own bot, specifically catered to the wants, needs, and quality of life of the administrators and users of this community. Automating the most tedious, and frequent actions the community adminisitrators are required to deal with manually helps delegate this burden away from the administrators of the community and to tripleBOT . I created tripleBOT with these ideas in mind with plans to maintain and continue its development to adjust and better cater to these needs. The main goal with this project has been, and will continue to be, automating tedious actions typically done manually with the help of various APIs and commands available for users to execute at a whim.

### Overview 

##### Commands - <em>(ban, unban, kick, add nickname, add role)</em> 

All commands are initiated through text-based messages sent by users within the Discord server. For the command to execute correctly, the user initiating the command must have the authorized permission(s) to perform the command they are attempting; otherwise the command is ignored.  An example is provided below:

> !ban @<USER> {OPTIONAL: reason}

##### Utility - <em>(OAuth2.0, Twitch API, DynamoDB)</em>

tripleBOT features integrations with the Twitch API and the use of OAuth2.0 authentication to automate the process of accessing linked Twitch account information and using this information to update a Discorder user's "ego" role. "Ego" roles are based on the number of years the user has followed a particular channel on Twitch. Discord has the ability for its users to link their Discord account to other accounts, such as Spotify, GitHub, Twitch, and many others. However, this information is not easily accessible to Discord bots (such as tripleBOT). The only way for tripleBOT to access these connections to make Twitch API calls and request the follow date of a specific pair of users is through the use of OAuth 2.0. OAuth 2.0 requires authorization from each user for their information to be accessible, in an attempt to prevent Discord bots from performing large-scale malicious actions. Once authorization is given, the desired information is parsed and stored in a DynamoDB table for easy lookup and access. Without this information, a user's role in the Discord server cannot be updated accurately. OAuth2.0 requires a redirect URL for information to be sent to, so a front-end application was built to aid the authorization process required by OAuth2.0.  

### Demos

[![Demo1](http://img.youtube.com/vi/kw3hsDrF8d4/0.jpg)](http://www.youtube.com/watch?v=kw3hsDrF8d4 "Demo1")



Here is a small demonstration of the text based commands tripleBOT offers. Many of the commands check the permissions of the sender and validate whether or not the sender has access to those actions based on their role in the server. 

[![Demo2](http://img.youtube.com/vi/Cxc345X7tDI/0.jpg)](http://www.youtube.com/watch?v=Cxc345X7tDI "Demo2")

Here we see how tripleBOT operates on startup. 

Initially we notice that the current channel we are in, "live-now", has no messages sent by tripleBOT and we notice that the DynamoDB table is empty. On startup tripleBOT parses through all users in the server and any user whose Discord information is not already included in the DynamoDB table is added as an entry. We also notice that tripleBOT sends a embeded message in "live-now" on startup. tripleBOT calls the Twitch API to check if a current streamer is live, once that streamer goes live tripleBOT will send an embeded message in "live-now" to notify the users of the server that he is live. 

When users leave the server tripleBOT is signaled and their stored entry in the DynamoDB table is wiped, this also applies to when new users join the server. When new users join the server, tripleBOT is signaled and creates an entry for the specified user in the DynamoDB table so that their information is easy to access later down the line. 

[![Demo3](http://img.youtube.com/vi/CYegnu_B7c0/0.jpg)](http://www.youtube.com/watch?v=CYegnu_B7c0 "Demo3")

Lastly, we see how tripleBOT uses OAuth2.0.

OAuth2.0 is used with tripleBOT so users can give tripleBOT permission to access their Discord connections. Discord connections, as previously mentioned, can include a synced Twitch account. Authenicating with OAuth2.0 gives tripleBOT access to all the user's synced connections, including Twitch, and calls the Twitch API using the authenicated user's Twitch username to find their Twitch ID. Using the user's Twitch ID, tripleBOT calls the Twitch API again to request the date the now authenicated user began following the streamer we previously saw in the embeded message sent in "live-now". The follow date (timestamp) is stored in UTC. This information is requested from the Twitch API and the authenticated user's entry is updated in the DynamoDB table. 

The follow date is then used to update the user's role in the server based on how long they have been following the streamer in years. 

### Installation

tripleBOT is currently only able to be added to Discord servers through a verified invite link from myself, the application owner. At its current stage, tripleBOT is intended for single server use. tripleBOT may be more easily available to others in the future, as this is an ongoing project with intended future work.



 

