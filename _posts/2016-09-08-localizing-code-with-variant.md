---
title: "Localizing Code With std::variant"
categories:
  - Organization
tags:
  - STL
  - pretty code
  - variant
permalink: /:categories/:title/
modified: 2016-09-08
---

{% include base_path %}

As we all know, C++17 is on the horizon.  With it's release will comes a new member to data container family, `std::variant`.

## Looking at `std::variant`

Let's take a look at it's definition:

```cpp
template <class... Types>
class variant;
```

Variant types are useful for all types of applications, particularly when you want to flatten hierarchies into simpler, more independent types.

Let's see a simple use case for `std::variant`:

```cpp
#include <iostream>
#include <string>
#include <variant>

int main() {
  using namespace std::string_literals;
  std::variant<int, std::string> v;

  // use std::string side
  v = "Hello, World!"s;
  std::cout<<std::get<std::string>(v)<<'\n';

  // use int side
  v = 42;
  std::cout<<"Meaning of life: "<<std::get<int>(v)<<'\n';
}
```

As contrived as this example may be it shows how flexable `std::variant` can be.  It allows us to bind several types together that can have semantic meaning within our application without the types poisoning each other with interface requirements and let's us treat the base class, `std::variant` in this case, as a value type.

## Working with variants

Along with `std::variant` comes a very welcomed utility meant for generically handling types within a variant, `std::visit` defined as follows:

```cpp
template <class Visitor, class... Variants>
constexpr common_type visit(Visitor&& vis, Variants&&... vars);
```

There are a couple of things to notice about `std::visit`

1. We accept a single visitor for multiple variant types and,
2. variants don't need to contain homogeneous types across them.

Because of these properties our visitor provides a good solution to the [multi-method problem](https://en.wikipedia.org/wiki/Multiple_dispatch), pre-canned in the STL!

Let's see a simple use case for `std::visit`:

```cpp
#include <iostream>
#include <string>
#include <variant>

template <typename... Ts>
void print_variant(const std::variant<Ts...>& v) {
  struct print_visitor {
    void operator()(int i)                const { std::cout<<i<<'\n'; }
    void operator()(const std::string& s) const { std::cout<<s<<'\n'; }
  };
  std::visit(print_visitor{}, v);
}

int main() {
  using namespace std::string_literals;
  std::variant<int, std::string> v;

  // use std::string side
  v = "Hello, World!"s;
  print_variant(v);

  // use int side
  v = 42;
  print_variant(v);
}
```

As great as this is, do you see a problem?  The problem that I see is that, while a visitor object _can_ be locally declared, if we want to handle generic cases we have two options.

1. Either collapse all of the visit cases into a single generic lambda:

    ```cpp
    std::visit([](const auto& e) { std::cout<<e<<'\n'; }, v);
    ```

2. Declare your visitor outside of your function with a templated member function to handle the generic cases (due to &sect;_14.5.2.2_ in the standard).

Luckily, there is a very easy fix for this, lambda composition.

## Localizing with `std::variant`

What are the goals of variants?  One could argue some goals behind variants are to:

* Flatten hierarchies
* Mix value semantics with the complexity of interface based types (ie. have a generic interface that multiple types _may_ use)
* **Localize behaviours / algorithms**

This last aspect is easy to solve with a small library that is meant to compose lambda objects into a single, `operator()` overloaded object.  Let's see what `print_variant` looks like after this transformation:

```cpp
#include <iostream>
#include <string>
#include <variant>

#include <lambda_util>

template <typename... Ts>
void print_variant(const std::variant<Ts...>& v) {
  std::visit(
    lambda_util::compose(
      [](int i)                { std::cout<<i<<'\n';  },
      [](const std::string& s) { std::cout<<s<<'\n';  },
      [](const auto&)          { std::cout<<"TODO\n"; }),
    v);
}

int main() {
  using namespace std::string_literals;
  std::variant<int, std::string> v;

  // use std::string side
  v = "Hello, World!"s;
  print_variant(v);

  // use int side
  v = 42;
  print_variant(v);
}
```

With this transformation the reader has all of the necessary code for the behaviour in the function itself.  Maintainers will truly appreciate a compact function like this.

Just to show this composer doesn't do any extra work outside of template metaprogramming, let's see one more example:

```cpp
int main() {
  std::variant<int, const char*, double> v;
  v = 10.5;
  return std::visit(
      lambda_util::compose(
        [](double)      { return 0; },
        [](const char*) { return 1; },
        [](auto)        { return 2; }),
      v);
}
```

The compiler I was using was `GCC 7 (snapshot)` with `-O2 -std=c++1z`.  Here is its output:

```nasm
main:
  xorl  %eax, %eax
  ret
```

This anecdote speaks to 3 things, the amout of `std::variant` that is `constexpr` compatible, the `lambda_util::compose` lightweight functionality, and the fine folks on the GNU GCC team and the excellent work they do with their optimizer <i class='fa fa-smile-o' />

For those who want to take a good look at `lambda_util::compose`'s implementation, see [here!](https://gist.github.com/cdacamar/584c6d43a9cca1ccffec3b36ad5dfe3f).

Until next time! <i class='fa fa-thumbs-up' />