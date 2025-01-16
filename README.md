# Vedgekit

[vedgekit.calebirwin.ca](https://vedgekit.calebirwin.ca/)

Vedgekit is a demonstration e-commerce site created to show issues with the frontend of the Venxia e-commerce platform. It accompanies a [21-page report](./Venxia%20Report%20for%20Guild%20Stationers.pdf) that outlines issues and solutions. In the year since the report, many of the report's small user experience suggestions have been applied, while performance improvements are currently in progress. Vedgekit is effectively a new frontend for [test.shopofficeonline.com](https://test.shopofficeonline.com/), though in practice it handles its own sessions and has a separate backend. At present, Vedgekit is still at least twice as fast as Venxia by all relevant metrics (FCP, LCP, TTI).  

January 2025 Update: Venxia has decreased product page load times by 30-50%. Vedgekit is still over twice as fast.

## Tech Stack

- **V**enxia: A niche e-commerce platform
- Cloudflare’s **Edge** Workers: A globally distributed serverless runtime. Note, Vedgekit can run on many different JavaScript runtimes, including other serverless solutions such as AWS Lambda or a server running Node.js or Bun.
- Svelte**Kit**: A modern full-stack Javascript framework. SvelteKit is powered by Svelte which is highly performant, compiled, and feature complete.

## Request Flow

Vedgekit uses HTTP response streaming to improve performance and user experience, as shown in the diagram below.
![alt text](./Vedgekit%20System%20Diagram.png)
