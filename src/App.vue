<template>
  <v-app class="bg-white">
    <!-- Header -->
    <v-app-bar elevation="0" class="bg-white border">
      <v-container>
        <v-row align="center" class="justify-space-between">
          <v-col cols="auto">
            <div class="d-flex align-center">
              <span class="g2a-text-22 g2a-text-bold-800 text-error">Go2</span>
              <span class="g2a-text-22 g2a-text-bold-800">Andaman</span>
            </div>
          </v-col>
          <v-col cols="auto">
            <span class="g2a-text-14 text-grey">Secure Booking</span>
            <v-icon size="20" class="ml-2 text-green">mdi-lock</v-icon>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
