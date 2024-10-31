# Simple email read receipts:
A simple read receipt feature for gmail. I had the need to track whether the email I sent was opned or not. I had used a third party extension earlier for this requirement but this time I was curious about the working mechanism of this feature so I looked it up. The core of the idea (detailed below) seemed very simple to me so I wset about to implement it myself.

As I tried to implement the idea I began to encounter several challenges, a few I was able to solve, rest I am still struggling with and have put things on hold since I need to focus more on landing a job for now. I will describe what I can recall below.


### This is the crux of the idea: 
Embed a html tag that is automatically rendered by the most clients and which also make a web request in process of rendering itself. Mostly that bit of html is an `img` tag with a get API endpoint in its `src` tag, it is usually styled to be invisible (single pixel length height and width and `display: none` style properties). This invisible `img` tag embedded in the email is essentially our read receipt. Now whenever this email is opneded, the html image will be rendered as well, the rendering of the image will require to fetch the resource/image in the image's source tag and just like that we have notified our server that the email was opened. The server can log this and maintain records.


### problems encountered:
1. Avoiding the read count increment when the original sender send the emails
Came across a few possible solutions such as - ignoring the count incr request when the request comes from a pre registered original sender IP address.

2. Google caching the src URL
Earlier I tried to communicate the tracking_id of the mail to the server using a query param but google was caching that request and that defeats the purpose. Had some success using path params but not sure if that works properly as of now as I am pausing the project (no need anymore).
