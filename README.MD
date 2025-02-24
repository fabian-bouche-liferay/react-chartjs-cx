# Instructions

This is a React CX relying on vite and working with the Liferay built-in React 16.12.0
which is bundled until 2024.Q4.

As we'll move to 2025.Q1, I'll have some changes to make to adapt it to React 18.

When I'm using `yarn dev` in standalone, I have to set the env variable `LOCAL_DEV`
to `"true"`.

When I'm deploying it against Liferay using `blade gw deploy`, I set it back to
`"false"`.