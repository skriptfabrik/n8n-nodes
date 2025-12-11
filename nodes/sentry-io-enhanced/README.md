# @skriptfabrik/n8n-nodes-sentry-io-enhanced

[![NPM Version](https://img.shields.io/npm/v/@skriptfabrik/n8n-nodes-clockify-enhanced)](https://www.npmjs.com/package/@skriptfabrik/n8n-nodes-clockify-enhanced)
[![NPM Downloads](https://img.shields.io/npm/dt/@skriptfabrik/n8n-nodes-clockify-enhanced)](https://www.npmjs.com/package/@skriptfabrik/n8n-nodes-clockify-enhanced)

> Enhanced [Sentry](https://sentry.io/) community nodes for your [n8n](https://n8n.io/) workflows

This is an n8n community node. It lets you use [Sentry](https://sentry.io/) nodes for your n8n workflows.

Sentry is a full stack monitoring app.

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
3. Enter `@skriptfabrik/n8n-nodes-sentry-io-enhanced` in **Enter npm package name**.
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes: select
   **I understand the risks of installing unverified code from a public source**.
5. Select **Install**.

After installing the node, you can use it like any other node. n8n displays the node in search results in the **Nodes**
panel.

## Operations

It supports these operations:

- Send [event](https://develop.sentry.dev/sdk/envelopes/#event) envelope

## Credentials

The provided credential can be used to authenticate with the Sentry envelope resource using a project ID and DSN.

## Compatibility

Tested against n8n version 1.0+.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Sentry Envelopes](https://develop.sentry.dev/sdk/envelopes/)
