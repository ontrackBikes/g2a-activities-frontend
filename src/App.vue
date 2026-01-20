<template>
  <v-app class="bg-white">
    <!-- Header -->
    <v-app-bar elevation="0" class="bg-white border">
      <v-container>
        <v-row align="center" class="justify-space-between">
          <v-col cols="auto">
            <v-img src="/assets/g2a_logo.png" width="180px"></v-img>
          </v-col>
          <v-col cols="auto">
            <span class="g2a-text-14 text-grey">Secure Booking</span>
            <v-icon size="20" class="ml-2 text-darkGreen1">mdi-lock</v-icon>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
