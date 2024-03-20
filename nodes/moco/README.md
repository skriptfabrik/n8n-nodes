# @skriptfabrik/n8n-nodes-moco

[![NPM Version](https://img.shields.io/npm/v/@skriptfabrik/n8n-nodes-moco)](https://www.npmjs.com/package/@skriptfabrik/n8n-nodes-moco)
[![NPM Downloads](https://img.shields.io/npm/dt/@skriptfabrik/n8n-nodes-moco)](https://www.npmjs.com/package/@skriptfabrik/n8n-nodes-moco)

> MOCO community nodes for your [n8n](https://n8n.io/) workflows

This is an n8n community node. It lets you use [MOCO](https://www.mocoapp.com/) in your n8n workflows.

MOCO is an ERP agency software with the following features:

- Time recording
- Billing
- Customer acquisition
- Capacity planning
- Personnel & contacts
- Expenses

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
3. Enter `@skriptfabrik/n8n-nodes-moco` in **Enter npm package name**.
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes: select
   **I understand the risks of installing unverified code from a public source**.
5. Select **Install**.

After installing the node, you can use it like any other node. n8n displays the node in search results in the **Nodes** panel.

## Operations

It supports these operations:

- Create, delete, get, list and update activities
- Create, delete, get, list and update project
- Create, delete, get, list and update users

## Credentials

Create a free MOCO account [here](https://www.mocoapp.com/anmeldung/start) which allows you to test it for 30 days
without obligation.

- Remember the Sub-Domain
- Generate an API Key here: Settings -> Extensions -> API & WebHooks -> API Keys
- Find the Web Hook Secret here: Settings -> Extensions -> API & WebHooks -> WebHooks

## Compatibility

Tested against n8n version 1.0+.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [MOCO API Documentation](https://hundertzehn.github.io/mocoapp-api-docs/)
