# @skriptfabrik/n8n-nodes-channable

[![NPM Version](https://img.shields.io/npm/v/@skriptfabrik/n8n-nodes-channable)](https://www.npmjs.com/package/@skriptfabrik/n8n-nodes-channable)
[![NPM Downloads](https://img.shields.io/npm/dt/@skriptfabrik/n8n-nodes-channable)](https://www.npmjs.com/package/@skriptfabrik/n8n-nodes-channable)

> [Channable](https://channable.com/) community nodes for your [n8n](https://n8n.io/) workflows

This is an n8n community node and credential. It lets you consume the [Channable](https://channable.com/) API in your n8n
workflows.
Channable is a fully integrated way to market your products online. List, advertise and optimize millions of products
across channels and teams.

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
3. Enter `@skriptfabrik/n8n-nodes-channable` in **Enter npm package name**.
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes: select
   **I understand the risks of installing unverified code from a public source**.
5. Select **Install**.

After installing the node, you can use it like any other node. n8n displays the node in search results in the **Nodes** panel.

## Operations

It supports these operations:

- Retrieve a order with the given ID
- Return a order manually with the given ID
- Create a test return
- Retrieve a single return with the given ID
- Retrieve a list of returns
- Retrieve a anonymized list of returns
- Update the status of a return
- Update the offers' stock of a selected project

## Credentials

The provided credential can be used to authenticate with Channable.

## Compatibility

Tested against n8n version 1.0+.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Channable API (v1)](https://api.channable.com/v1/docs/)
