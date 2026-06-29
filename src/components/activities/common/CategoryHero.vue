<template>
  <div
    class="hero"
    :style="{
      backgroundImage: `url(${category.cover_media_url || fallbackImage})`,
    }"
  >
    <div class="overlay">
      <v-container class="fill-height">
        <v-row
          class="fill-height"
          align="center"
        >
          <v-col
            cols="12"
            md="7"
          >
            <div class="hero-content">

              <div class="hero-chip">
                GO2ANDAMAN EXPERIENCES
              </div>

              <h1 class="hero-title">
                {{ category.cover_title || category.name }}
              </h1>

              <div class="hero-subtitle">
                {{ category.cover_subtitle }}
              </div>

              <div class="hero-overview">

                <div class="overview-item">
                  <v-icon icon="mdi-shape" />
                  {{ category.overview?.product_types || 0 }}
                  Activity Types
                </div>

                <div class="overview-item">
                  <v-icon icon="mdi-map-marker-path" />
                  {{ category.overview?.products || 0 }}
                  Experiences
                </div>

              </div>

            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script setup>
defineProps({
  category: {
    type: Object,
    required: true,
  },
});

const fallbackImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
</script>

<style scoped>
.hero {
  height: 440px;
  border-radius: 28px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
}

.overlay {
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(6, 18, 34, .90),
    rgba(6,18,34,.65),
    rgba(6,18,34,.18)
  );
}

.hero-content{
  color:white;
  max-width:620px;
}

.hero-chip{
  display:inline-block;
  padding:8px 16px;
  border-radius:30px;
  background:rgba(255,255,255,.15);
  backdrop-filter:blur(12px);
  font-size:12px;
  font-weight:700;
  letter-spacing:1px;
  margin-bottom:22px;
}

.hero-title{
  font-size:58px;
  font-weight:800;
  line-height:1.05;
  margin-bottom:18px;
}

.hero-subtitle{
  font-size:20px;
  line-height:1.8;
  opacity:.95;
}

.hero-overview{
  display:flex;
  gap:30px;
  margin-top:38px;
  flex-wrap:wrap;
}

.overview-item{
  display:flex;
  align-items:center;
  gap:8px;
  font-weight:600;
}

@media(max-width:960px){

.hero{
  height:320px;
}

.hero-title{
  font-size:38px;
}

.hero-subtitle{
  font-size:16px;
}

}
</style>