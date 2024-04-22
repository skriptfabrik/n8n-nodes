# @skriptfabrik/n8n-nodes-fulfillmenttools

[![NPM Version](https://img.shields.io/npm/v/@skriptfabrik/n8n-nodes-fulfillmenttools)](https://www.npmjs.com/package/@skriptfabrik/n8n-nodes-fulfillmenttools)
[![NPM Downloads](https://img.shields.io/npm/dt/@skriptfabrik/n8n-nodes-fulfillmenttools)](https://www.npmjs.com/package/@skriptfabrik/n8n-nodes-fulfillmenttools)

> [fulfillmenttools](https://fulfillmenttools.com/) community nodes for your [n8n](https://n8n.io/) workflows

This is an n8n community node and credential. It lets you consume the [fulfillmenttools](https://fulfillmenttools.com/)
API in your n8n workflows.
fulfillmenttools next Generation Order Management, Streamline your on- and offline business with our end-to-end order
lifecycle management backed by the power of 90+ years of retail experience.

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
3. Enter `@skriptfabrik/n8n-nodes-fulfillmenttools` in **Enter npm package name**.
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes: select
   **I understand the risks of installing unverified code from a public source**.
5. Select **Install**.

After installing the node, you can use it like any other node. n8n displays the node in search results in the **Nodes** panel.

## Operations

It supports these operations:

- Add a new order for future fulfillment
- Retrieve a order with the given ID
- Return all orders
- Add a new facility
- Delete a favility with the given ID
- Retrieve a facility with the given ID
- Return all facilities
- Patch a facility with the given ID
- Create a connection of a configured carrier to the facility with the given ID
- Get the details for a carrier related to the facility with the given ID
- Get the available carriers for a facility
- Connect a configured carriere to the facility with the given ID

## Credentials

The provided credential can be used to authenticate with fulfillmenttools.

## Compatibility

Tested against n8n version 1.0+.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [fulfillmenttools API](https://fulfillmenttools.github.io/api-reference-ui/)
