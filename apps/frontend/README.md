This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




<!-- 

// pointToLineSegmentDistance documentation

## What the Function Does
In simple terms, the pointToLineSegmentDistance function calculates the shortest possible distance from a single point to a line segment.

Think of it like this: If you have a straight road (the line segment) and you are standing in a field nearby (you are the point), this function finds the length of the shortest path from you to the road.

## Why It's Needed for the Eraser
This function is crucial for making the eraser work on lines and pencil paths. Here’s why:

Lines are Infinitely Thin: In your code, a shape like a rectangle has a clear area. It's easy to check if the mouse pointer (x, y) is inside that area. A line, however, is just defined by a start point and an end point. Mathematically, it has zero width, making it impossible to click exactly on it.

Creating a "Hitbox": To solve this, you need to pretend the line has some thickness, like a "hitbox" or a zone of sensitivity around it. You can't just check if the mouse is on the line; you have to check if it's close enough to the line.

The Solution: This function calculates how close the mouse pointer is. In the code, you then check if that distance is less than a small number (e.g., 5 pixels).

if (distance < 5) is basically asking: "Is the mouse pointer within 5 pixels of this line segment?"

If the answer is yes, you can treat it as a "hit" and erase the line.

Without this function, your eraser would work on rectangles and circles, but it would be unable to detect and erase any lines or freehand drawings.

## How the Code Works
Let's look at the logic using the "you and the road" analogy.

JavaScript

function pointToLineSegmentDistance(px, py, x1, y1, x2, y2) {
    // (px, py) is your position (the mouse pointer)
    // (x1, y1) -> (x2, y2) is the road (the line segment)
const l2 = (x1 - x2) ** 2 + (y1 - y2) ** 2;
This calculates the squared length of the road. It's a common performance trick to avoid using the slow Math.sqrt() function until the very end.

if (l2 === 0) return ...;
This is a special case. If the length is zero, the "road" is actually just a single point (the start and end points are the same). The code then simply returns the distance from you to that single point.

let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
This is the core math. It finds the "projection" of your point onto the infinite line that the road lies on. The value t tells you where that projection lands.

If t is between 0 and 1, your shortest path is perpendicular to the road, and you land somewhere on the road segment itself.

If t is less than 0, your shortest path is to the start of the road (x1, y1).

If t is greater than 1, your shortest path is to the end of the road (x2, y2).

t = Math.max(0, Math.min(1, t));
This is a clever step that handles the cases above. It "clamps" t so it's never smaller than 0 or bigger than 1.

If t was -0.5, it becomes 0.

If t was 1.5, it becomes 1.

If t was 0.7, it stays 0.7.
This ensures we are always looking at a point that is actually on the road segment, not on the infinite line extending from it.

const nearestX = ...; const nearestY = ...;
Using the clamped t value, this calculates the coordinates of the closest point on the road segment to you.

return Math.sqrt(...);
Finally, it calculates the straight-line distance from your position (px, py) to that closest point (nearestX, nearestY). This is the shortest distance you were looking for. -->