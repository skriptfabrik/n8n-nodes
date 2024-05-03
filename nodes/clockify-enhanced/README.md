# @skriptfabrik/n8n-nodes-clockify-enhanced

[![NPM Version](https://img.shields.io/npm/v/@skriptfabrik/n8n-nodes-clockify-enhanced)](https://www.npmjs.com/package/@skriptfabrik/n8n-nodes-clockify-enhanced)
[![NPM Downloads](https://img.shields.io/npm/dt/@skriptfabrik/n8n-nodes-clockify-enhanced)](https://www.npmjs.com/package/@skriptfabrik/n8n-nodes-clockify-enhanced)

> Enhanced [Clockify](https://clockify.me/) community nodes for your [n8n](https://n8n.io/) workflows

This is an n8n community node. It lets you use [Clockify](https://clockify.me/) webhooks as trigger nodes for your n8n workflows.

Clockify is a time tracker and timesheet app for teams.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)  
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community
nodes documentation.

1. Go to **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `@skriptfabrik/n8n-nodes-clockify-enhanced` in **Enter npm package name**.
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes: select
   **I understand the risks of installing unverified code from a public source**.
5. Select **Install**.

After installing the node, you can use it like any other node. n8n displays the node in search results in the **Nodes** panel.

## Operations

It supports these operations:

- Register a webhook in the API which will call the trigger node on configured event
- Update a project with the given ID
- Patch the memberships of a project with the given ID

## Credentials

You can use the built-in [Clockify credentials](https://docs.n8n.io/integrations/builtin/credentials/clockify/) to
authenticate with Clockify.

## Compatibility

Tested against n8n version 1.0+.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Clockify API (v1)](https://docs.clockify.me/)
