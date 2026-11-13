# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vue 3 with Vue CLI, TypeScript, Vuex, Vue Router, Tailwind CSS, and a browser-first document/media workspace. The app is a web application with authentication flows, file and folder management, markdown editing, media previews, and sharing.

## Users

Primary users are likely individuals or small teams using a browser-based workspace to store, organize, search, edit, preview, and share files and documents. The product appears to support personal knowledge and file management workflows rather than a single-purpose utility.

## Product Purpose

This product provides a web workspace for managing content, files, folders, notes, media, and shareable links from a single authenticated interface. Its value is in combining storage, content editing, organization, and lightweight collaboration into a single experience.

## Positioning

The product positions itself as a personal or lightweight cloud workspace: browser-first, modular, and focused on content management rather than enterprise-scale team tooling. It is differentiated by its combination of document editing, file browsing, media viewing, and shareable links in one app.

## Operating Context

The app is used in a browser, with a gated authenticated flow for app features and public routes for shared content. Core workflows include uploading files, organizing folders, browsing search results, opening documents in an editor, reviewing previews, and sharing links to content. The implementation also includes mobile-aware layouts, offline-friendly assets, and a dark/light theme system.

## Capabilities and Constraints

Confirmed capabilities include:

- authenticated app shell and route guards;
- file and folder views with search and detail flows;
- markdown or document editing interfaces;
- media preview, metadata display, and download/share flows;
- public share links and proxy download routes;
- dark/light theming and responsive layout behavior.

Confirmed technical constraints include:

- web application, not a native iOS or Android app;
- implemented in Vue 3 with client-side state management and route-based navigation;
- build and deployment assumptions match a Vue CLI web app; and
- branding and product narrative are not yet formally documented in the repo.

## Brand Commitments

No binding brand strategy, voice, or visual identity specification is currently documented in this project. The name "sky" is present in the app shell and route metadata, but no formal brand system or approved copy guidance has been captured here.

## Evidence on Hand

- README: project setup and Vue CLI commands
- package.json: Vue 3, Vuex, Vue Router, Tailwind, TypeScript, and asset/media dependencies
- src/router/index.ts: authenticated app routes, public share routes, folder/files/editor flows
- src/App.vue: global shell, sidebar, modal system, search, theming, upload/share interactions
- src/store/*: state structure for auth, files, folders, shares, editor, and notifications
- src/views/* and src/components/*: document/media workspace, editor, folders, sharing, upload and preview UI

## Product Principles

1. Keep content and files in one place so users can find and act on them with minimal friction.
2. Favor browser-based accessibility and cross-device usability over a native-only workflow.
3. Support quick document/media workflows without forcing users into heavy enterprise conventions.
4. Preserve simple sharing and retrieval patterns for personal or lightweight collaborative use.
5. Treat auth, organization, and previewing as core product mechanics rather than secondary features.

## Accessibility & Inclusion

No product-specific accessibility requirements are confirmed beyond standard web accessibility expectations. The app includes theme contrast options and responsive layouts, but no formal accessibility statement or user-needs inventory has been captured in the repo.
