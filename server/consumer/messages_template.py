MESSAGE_LINK = "http://www.reddit.com/message/messages/{}"

NOM_REPLY = """
Thanks for the {} been nominated. We'll put it under
consideration and be in contact with the subreddit if it is chosen
to be featured.
"""

NEW_REPLY = """
{} too new to feature here. We like each subreddit to have an existing
community before featuring it and so we've set a rough age limit of 30
days since creation. If you're a moderator of the subreddit,
you can advertise your sub on /r/NewReddits, /r/NewSubreddits, or
/r/obscuresubreddits. When the community is old enough send us another
message and we'll go from there.
"""

BIG_REPLY = """
{} too big to feature here. We like each subreddit to have under 1000 users.
If you're a moderator of the subreddit, you can advertise your
sub on /r/NewReddits, /r/NewSubreddits, /r/obscuresubreddits or nominate
your feature for /r/SubredditOfTheDay.
"""

ERR_REPLY = """
{} causing errors. I'm sorry but I can't give you a specific reason why
this happened, but a real person will be able to help you out.
"""

PRIV_REPLY = """
{} private. I can't look at private subreddits. Consider making your subreddit
public if you want it to be nominated here.
"""

INVAL_REPLY = """
{} invalid. Which means it doesn't exist. Check to make sure everything is
spelled correctly and if it isn't, send us another message with the
correct spelling.
"""

BOT_FOOTER = """
___

^I'm ^a ^bot, ^reply ^to ^this ^message ^if ^there ^is ^a ^problem
^or ^have ^any ^comments ^and ^a ^real ^person ^will ^be ^able ^to ^help ^you.
"""

FEATURE_TITLE = """
Congratulations, /r/{} has been featured on /r/TinySubredditoftheDay
"""

NOM_POST = """
**Sub**: {}\n\n
**Subscribers**: {}\n\n
**Age**: {} months old\n\n
**18+**: {}\n\n
[Mod Message]({})\n\n
---------------------------------------\n\n
{}
"""

SELF_TEXT_BODY = """
[Here's a link to the /r/TinySubredditoftheDay thread!]({})
"""

WARNING_MESSAGE = """
There is no post ready for today ({}).

----

Here are links to nominations that we have recieved responses from:

{}

----

Here's how to format the responses:

Title: July 9th, 2015 /r/example: Testing

Title of the subreddit: \*\*/r/example**

Subscriber count: \*\*0**

A line or few describing the subreddit.

Then the mod Q&A:

\*\*Could you introduce yourselves?**

\----------------------------------- (should go directly under line without a space)


 /u/mod1- Answer

\----------------- (line break before and after this line)

 /u/mod2- Answer

[Sticky with more info](https://www.reddit.com/r/TSROTD_Dev/comments/3cpwpn/the_ultimate_mod_training_post_click_here_for_a/).
"""

SUCCESS_MESSAGE = """
Subreddit of the day has been posted for today ({}).

[Here's a link to the post]({}).
"""
