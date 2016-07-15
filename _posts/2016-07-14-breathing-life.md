---
title: "Breathing Life: What to Expect Here"
header:
  overlay_image: denali-pan.jpg
  caption: "Denali National Park"
categories:
  - General
tags:
  - winapi
  - STL
  - pretty code
permalink: /:categories/:title/
modified: 2016-07-14
---

{% include base_path %}

So what can you expect here? In a word, `code`. Lots of code! Why? A couple of reasons:

1.  I am a very visual person, I learned (and continue to learn) through example. When I see results I want to
    know how we got there. Understanding results is a small part of a long and convoluted battle in converting
    and handling data. My personal interest lies in that conversion.
2. Most of us my know of an interesting quote,

    > "Show me your flowchart and conceal your tables, and I shall continue to be mystified. Show me your tables,
    > and I won't usually need your flowchart; it'll be obvious."
    > – **Fred Brooks, The Mythical Man-Month**

    A very similar quote was derived from this,

    > "Show me your code and conceal your data structures, and I shall continue to be mystified. Show me your data
    > structures, and I won't usually need your code; it'll be obvious."
    > - **Eric S. Raymond, The Cathedral and The Bazaar**

    While I don't necessarily disagree with latter quote, I don't identify with it. Code, to me, is important.
    What's more, good code is essential for the longevity of any project/product.

There's one more aspect of the type of code I, personally, enjoy. I like using code that has a good and intuitive interface.
If a library, for example, has a good interface you almost don't find yourself going to the documentation to discover
it's secrets. The C++ standard library is a good example of code that is very self documenting. Most Windows API
calls are an example a library that isn't very self documenting. Just for kicks, let's quickly take a look:

Example of the Windows Thread API:
<script src="https://gist.github.com/cdacamar/6c4eb9fdbdb6ecf3d62d56ec6ccccc8e.js"></script>

And here's how to use it:
<script src="https://gist.github.com/cdacamar/e0afb184ea68404c8b3437406464e033.js"></script>

So... this is... not pretty. In my personal opinion. Perhaps it's not fair for me to pick on Win API because, after all,
it's old. Really old. In fact `CreateThread` is still supported as far back as Windows XP. That makes this API at least **15**
years old. Be that as it may, libraries like this exist, and are still being developed. C++ *can* do better!

So let's do better. Here's `std::thread`:
<script src="https://gist.github.com/cdacamar/2ef0285ae8aaa6a0b6be7185d87ffeb1.js"></script>

And here's how to use it:
<script src="https://gist.github.com/cdacamar/95ee0b0f300e2eb906817554f619922a.js"></script>

It's obvious to see why it might be preferable to use `std::thread` over the direct `CreateThread`. Abstracting complexity from the
developer allows them to focus their efforts on a projects functionality over ramping up to the level of understanding required to
use direct Win API calls.

This is what I like to do. Abstract. Efficiently. And sometimes make some fun things along the way. <i class='fa fa-thumbs-up' />