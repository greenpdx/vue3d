// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').then(function (registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope)
    }, function (err) {
      console.log('ServiceWorker registration failed: ', err)
    })
  })
}

var CACHE_NAME = 'tax-n-vote-v1'
var urlsToCache = [
  '/',
  'inline.bundle.js',
  'polyfills.bundle.js',
  'styles.bundle.js',
  'vendor.bundle.js',
  'main.bundle.js',
  '/mongodb'
]

self.addEventListener('install', function (evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened Cache')
        return cache.addAll(urlsToCache)
      })
  )
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return response
        if (response) {
          return response
        }
        return fetch(event.request)
      }
    )
  )
})

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

const debug = true

Vue.mixin({
  methods: {
    dbgPrt () {
      if (debug) {
        console.log(...arguments)
      }
    }
  }
})

/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
