<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
      </q-toolbar>
        <div>
        <div class="q-px-lg q-pt-xl q-mb-md">
          <div class="text-h3">Todo</div>
          <div class="text-subtitle1">{{ formattedString }}</div>
        </div>
      </div>
      <q-img src="../assets/beach-1.jpg"
        class="header-image absolute-top"/>
    </q-header>


    <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        :width="200"
        :breakpoint="400"
      >
        <q-scroll-area style="height: calc(100% - 192px); margin-top: 192px; border-right: 1px solid #ddd">
          <q-list padding>
            <q-item
              to="/"
              exact
              clickable
              v-ripple>
              <q-item-section avatar>
                <q-icon name="list" />
              </q-item-section>

              <q-item-section>
                Todo
              </q-item-section>
            </q-item>

            <q-item
              to="/help"
              exact
              clickable
              v-ripple>
              <q-item-section avatar>
                <q-icon name="help" />
              </q-item-section>

              <q-item-section>
                Help
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img class="absolute-top" src="../assets/beach.jpg" style="height: 192px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img src="../assets/avatar.jpg">
            </q-avatar>
            <div class="text-weight-bold">Maria Danica Esparrago</div>
            <div>@mdresparrago</div>
          </div>
        </q-img>
      </q-drawer>

    <q-page-container>
      <keep-alive>
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { date } from 'quasar'
import { ref, computed } from 'vue'



const leftDrawerOpen = ref(false)
const timeStamp = Date.now()
const formattedString = date.formatDate(timeStamp, 'dddd D MMMM')

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style lang="scss">
  .header-image{
    height: 100%;
    z-index: -1;
    opacity: .3;
    filter: grayscale(10%);
  }

  @media (min-width: 500px) {
	#title {
		font-size: 40px;
		font-weight: 800;
	}

	.landing-text {
		font-size: 20px;
	}

	svg {
		height: 30px;
		width: 30px;
	}
}

@media (min-width: 730px) {
	#title {
		font-size: 60px;
		font-weight: 800;
	}

	.landing-text {
		font-size: 30px;
	}

	svg {
		height: 40px;
		width: 40px;
	}
}

</style>
