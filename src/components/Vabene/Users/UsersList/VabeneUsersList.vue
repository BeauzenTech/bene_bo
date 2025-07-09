<template>
  <div class="card mb-25 border-0 rounded-0 bg-white letter-spacing">
    <div
        class="card-head box-shadow bg-white d-lg-flex align-items-center justify-content-between p-15 p-sm-20 p-md-25"
    >
      <div class="d-sm-flex align-items-center">
        <Button
            @click="gotoCreate"
            class="default-btn position-relative transition border-0 fw-medium text-white pt-11 pb-11 ps-25 pe-25 pt-md-12 pb-md-12 ps-md-30 pe-md-30 rounded-1 bg-success fs-md-15 fs-lg-16 d-inline-block me-10 mb-10 mb-lg-0"
            type="button"

        >

             Ajouter un utilisateur

          <i class="flaticon-plus position-relative ms-5 fs-12"></i>
        </Button>
<!--        <button-->
<!--            class="default-outline-btn position-relative transition fw-medium text-black pt-10 pb-10 ps-25 pe-25 pt-md-11 pb-md-11 ps-md-30 pe-md-30 rounded-1 bg-transparent fs-md-15 fs-lg-16 d-inline-block mb-10 mb-lg-0"-->
<!--            type="button"-->
<!--        >-->
<!--          Export-->
<!--          <i class="flaticon-file-1 position-relative ms-5 top-2 fs-15"></i>-->
<!--        </button>-->
      </div>
      <div class="d-flex align-items-center">
        <form class="search-box position-relative me-15" @submit.prevent>
          <input
              v-model="searchQuery"
              type="text"
              class="form-control shadow-none text-black rounded-0 border-0"
              placeholder="Rechercher un utilisateur"
              @input="currentPage = 1"

          />
          <button
              type="submit"
              class="bg-transparent text-primary transition p-0 border-0"
          >
            <i class="flaticon-search-interface-symbol"></i>
          </button>
        </form>
        <button
            class="dot-btn lh-1 position-relative top-3 bg-transparent border-0 shadow-none p-0 transition d-inline-block"
            type="button"
        >
          <i class="flaticon-dots"></i>
        </button>
      </div>
    </div>
    <div class="card-body p-15 p-sm-20 p-md-25">
      <div class="table-responsive">
        <table class="table text-nowrap align-middle mb-0">
          <thead>
          <tr>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0 ps-0"
            >
             ID
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0 ps-0"
            >
              Nom & Prenom
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              EMAIL
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              NUMÉRO TÉLÉPHONE
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              TYPE DE COMPTE
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              CRÉER LE
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              VERIFICATION
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              STATUS
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0 text-end pe-0"
            ></th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="isLoading">
            <td colspan="8" class="text-center py-4">
              <LoaderComponent/>
            </td>
          </tr>
          <tr v-else-if="!isLoading && allUser.length > 0"
              v-for="user in allUser" :key="user.id"
          >
            <th>
              <div
                  class="d-flex align-items-center ms-5 fs-md-15 fs-lg-16"
              >
                <a href="#" @click="gotoUserDetail(user)" class="mx-4">
                  #{{ getShortUuid(user.id)  }}
                </a>
              </div>
            </th>
            <th
                class="shadow-none lh-1 fw-medium text-black-emphasis title ps-0 text-capitalize"
            >
              <div class="d-flex align-items-center text-capitalize">

                <div
                    class="d-flex align-items-center ms-5 fs-md-15 fs-lg-16"
                >
                  <img
                      :src=" user.profil_picture || require('@/assets/images/user/avatar.png')"
                      class="rounded-circle me-8"
                      width="24"
                      height="24"
                      alt="user"
                  />
                  {{ user.first_name }} {{ user.last_name }}
                </div>
              </div>
            </th>
            <td class="shadow-none lh-1 fw-medium text-black-emphasis">
              {{ user.email }}
            </td>
            <td class="shadow-none lh-1 fw-medium text-black-emphasis">
              {{ user.phone_number || '-' }}
            </td>
            <td v-if="user.roles.length == 2" class="shadow-none lh-1 fw-medium text-black-emphasis">
              <span v-if="user.roles[1] === UserRole.FRANCHISE" class="badge text-bg-danger fs-13">{{fetchRole(user.roles[1])}}</span>
              <span v-else-if="user.roles[1] === UserRole.RESTAURANT" class="badge text-bg-primary fs-13">{{fetchRole(user.roles[1])}}</span>
              <span v-else-if="user.roles[1] === UserRole.UTILISATEUR" class="badge text-bg-info fs-13">{{fetchRole(user.roles[1])}}</span>
              <span v-else class="badge text-bg-warning fs-13">{{fetchRole(user.roles[1])}}</span>
            </td>
            <td v-if="user.roles.length == 1" class="shadow-none lh-1 fw-medium text-black-emphasis">
              <span v-if="user.roles[0] === UserRole.FRANCHISE" class="badge text-bg-danger fs-13">{{fetchRole(user.roles[0])}}</span>
              <span v-else-if="user.roles[0] === UserRole.RESTAURANT" class="badge text-bg-primary fs-13">{{fetchRole(user.roles[0])}}</span>
              <span v-else-if="user.roles[0] === UserRole.UTILISATEUR" class="badge text-bg-info fs-13">{{fetchRole(user.roles[0])}}</span>
              <span v-else class="badge text-bg-warning fs-13">{{fetchRole(user.roles[0])}}</span>
            </td>
            <td class="shadow-none lh-1 fw-medium text-muted">
              {{ convertDateCreate(user.created_at)  }}
            </td>
            <td class="shadow-none lh-1 fw-medium text-muted">
              <span v-if="user.is_verified" class="badge text-outline-success">Verifié</span>
              <span v-else class="badge text-outline-danger">Non-verifié</span>
            </td>
            <td>
              <!-- Toggle switch -->
              <div class="form-check form-switch">
                <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="user.is_active"
                    @change="toggleUserActivation(user, user.is_active)"
                />

              </div>
            </td>
            <td
                class="shadow-none lh-1 fw-medium text-body-tertiary text-end pe-0"
            >
              <div class="dropdown">
                <button
                    class="dropdown-toggle lh-1 bg-transparent border-0 shadow-none p-0 transition"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                  <i class="flaticon-dots"></i>
                </button>
                <ul class="dropdown-menu">
                  <li>
                    <a
                        @click="gotoUserDetail(user)"
                        class="dropdown-item d-flex align-items-center"
                        href="javascript:void(0);"
                    ><i
                        class="flaticon-view lh-1 me-8 position-relative top-1"
                    ></i>
                      Voir</a
                    >
                  </li>
                  <li>
                    <a
                        @click="gotoUserDetail(user)"
                        class="dropdown-item d-flex align-items-center"
                        href="javascript:void(0);"
                    ><i
                        class="flaticon-pen lh-1 me-8 position-relative top-1"
                    ></i>
                      Editer</a
                    >
                  </li>
                  <li>
                    <a
                        class="dropdown-item d-flex align-items-center"
                        data-bs-toggle="modal" data-bs-target="#confirmModal"
                        href="javascript:void(0);"
                        @click="selectionUser(user)"
                    ><i
                        class="flaticon-delete lh-1 me-8 position-relative top-1"
                    ></i>
                      Supprimer</a
                    >
                  </li>
                </ul>
              </div>
            </td>
          </tr>
          <tr v-else>
            <EmptyTable
                message="Aucun utilisateur pour le moment"
                :colspan="8"
                textClass="text-muted"
            />
          </tr>

          </tbody>
        </table>
      </div>
      <div
          class="pagination-area d-md-flex mt-15 mt-sm-20 mt-md-25 justify-content-between align-items-center"
      >
        <p class="mb-0 text-paragraph">
          {{ paginationInfo }}
        </p>
        <nav class="mt-15 mt-md-0">
          <ul class="pagination mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" aria-label="Previous"
                 @click.prevent="changePage(currentPage - 1)"
              >
                <i class="flaticon-chevron-1"></i>
              </a>
            </li>
            <li
                v-for="page in generatePageNumbers()"
                :key="page"
                class="page-item"
                :class="{ active: page === currentPage }"
            >
              <a
                  class="page-link" href="#"
                  @click.prevent="changePage(page)"
              >  {{ page }}</a>
            </li>

            <li
                class="page-item"
                :class="{ disabled: currentPage === totalPages }"
            >
              <a
                  class="page-link" href="#" aria-label="Next"
                  @click.prevent="changePage(currentPage + 1)"
              >
                <i class="flaticon-chevron"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>




  <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="confirmModalLabel">Confirmation de suppression</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center">
          <i class="fas fa-exclamation-triangle warning-icon"></i>
          <p class="mb-0">Êtes-vous sûr de vouloir supprimer ce utilisateur ?<br>Cette action est irrevesible.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            <i class="fas fa-times me-2"></i>Annuler
          </button>
          <button type="button" class="btn btn-danger" @click="confirmationDeleteAction(userSelected)" data-bs-dismiss="modal">
            <i class="fas fa-trash-alt me-2"></i>Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>


</template>
<script lang="ts">
import { defineComponent } from "vue";
import {listeUser, toggleActivationUser, deleteUser} from "@/service/api";
import {UserGeneralKey, UserRole} from "@/models/user.generalkey";
import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import {UserModel} from "@/models/user.model";
import EmptyTable from "@/components/Vabene/EmptyTable/EmptyTable.vue";
import {ApiResponse} from "@/models/Apiresponse";
import {PaginatedUsers} from "@/models/Apiresponse";
import {ActionCrud} from "@/enums/actionCrud.enum";

export default defineComponent({
  name: "VabeneUsersList",
  components: {LoaderComponent, EmptyTable},
  data(){
    return{
      usersResponse: null as ApiResponse<PaginatedUsers> | null,
      isLoading: false,
      currentPage: 1 ,
      searchQuery: '', // Ajout du champ de recherche
      originalUsers: [] as UserModel[], // Stockage des utilisateurs originaux
      userSelected: null,
    }
  },
  computed: {
    UserRole() {
      return UserRole
    },
    allUser(): UserModel[] {
      const users = this.usersResponse?.data?.items || this.originalUsers;
      if (!this.searchQuery) return users;

      const query = this.searchQuery.toLowerCase();
      return users.filter(user => {
        return (
            (user.first_name?.toLowerCase().includes(query)) ||
            (user.last_name?.toLowerCase().includes(query)) ||
            (user.email?.toLowerCase().includes(query)) ||
            (user.phone_number?.includes(query)) ||
            (this.fetchRole(user.roles[0])?.toLowerCase().includes(query))
            );
      });
    },

    pagination(): any {
      return this.usersResponse?.data?.pagination || {
        current_page: 1,
        total_items: 0,
        total_pages: 1,
        items_per_page: 8
      };
    },
    paginationInfo(): string {
      const { current_page, items_per_page, total_items } = this.pagination;
      const start = (current_page - 1) * items_per_page + 1;
      const end = Math.min(current_page * items_per_page, total_items);
      return `Affichage de ${start} à ${end} sur ${total_items} résultats`;
    },
    totalPages(): number {
      return this.pagination.total_pages;
    }
  },
  methods: {

      getShortUuid(uuid: string): string {
        return uuid.split('-')[0];
      },
    gotoUserDetail(user){
      this.$router.push({
        name: "VabeneAddUserPage",
        params: { action: ActionCrud.EDIT ,userID: user.id }
      });
    },
    gotoCreate(){
      this.$router.push({
        name: "VabeneAddUserPage",
        params: { action: ActionCrud.ADD }
      });
    },
    selectionUser(user){
      this.userSelected = user;
    },
    async confirmationDeleteAction(user){
      try {
        const response = await deleteUser(user.id) as ApiResponse<any>;
        //console.log(response)
        if (response.code === 201) {
          this.usersResponse = response;
          this.toast.success(response.message);

        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des utilisateurs");
        console.error(error);
      } finally {
        setTimeout(() =>  {
          this.fetchUsers(1);
        }, 2000);
      }
    },
    async toggleUserActivation(user, status){
      //this.isLoading = true;
      console.log(status)
      const payload = {
        'status': status
      }
      try {
        const response = await toggleActivationUser(user.id, payload) as ApiResponse<any>;
        //console.log(response)
        if (response.code === 201) {
          this.usersResponse = response;
          if (response.data) {
            const responseDecoded = response.data
            console.log(responseDecoded)
            this.toast.success(response.message);

          }

        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des utilisateurs");
        console.error(error);
      } finally {
        setTimeout(() =>  {
          this.fetchUsers(1);
        }, 2000);
      }
    },
    fetchRole(role: string): string {
      return UserGeneralKey.getRole(role);
    },
    convertDateCreate(date: string): string {
      return UserGeneralKey.formatDateToFrenchLocale(date);
    },
    async fetchUsers(page = 1) {
      this.isLoading = true;
      try {
        const response = await listeUser(page) as ApiResponse<PaginatedUsers>;
        console.log(response)
        if (response.code === 200) {
          this.usersResponse = response;
          if (response.data?.items) {
            this.originalUsers = response.data.items;
          }
          if (response.data && response.data.pagination) {
            this.currentPage = response.data.pagination.current_page;
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des utilisateurs");
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    changePage(page: number) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.fetchUsers(page);
      }
    },
    generatePageNumbers(): number[] {
      const pages: number[] = [];
      const maxVisiblePages = 100;
      const { current_page, total_pages } = this.pagination;

      let startPage = Math.max(1, current_page - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(total_pages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    }
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  mounted() {
    this.fetchUsers();
  }
});
</script>