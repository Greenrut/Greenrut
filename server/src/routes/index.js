import { Router } from 'express'
import { getHealth } from '../controllers/healthController.js'
import { changePassword, getAuthUser, loginAdmin, loginUser, signupAdmin, signupUser } from '../controllers/authController.js'
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js'
import { listPosts, getPost, createPost, updatePost, deletePost } from '../controllers/postController.js'
import { listResearchItems, createAdminResearchItem, deleteAdminResearchItem, listAdminResearchItems, updateAdminResearchItem } from '../controllers/researchController.js'
import { listLibraryItems, createAdminLibraryItem, deleteAdminLibraryItem, listAdminLibraryItems, updateAdminLibraryItem } from '../controllers/libraryController.js'
import { listUsers } from '../controllers/userController.js'
import { listCategories } from '../controllers/categoryController.js'
import { listTags } from '../controllers/tagController.js'
import { verifyPaystackPayment } from '../controllers/paymentController.js'
import { upload } from '../middleware/upload.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import {
  createAdminPost,
  createAdminProduct,
  createAdminUser,
  deleteAdminPost,
  deleteAdminProduct,
  deleteAdminUser,
  getAdminPost,
  getAdminProduct,
  getDashboard,
  listAdminCategories,
  listAdminPosts,
  listAdminProducts,
  listAdminTags,
  listAdminUsers,
  updateAdminPost,
  updateAdminProduct,
  updateAdminUser,
  uploadAdminImage,
  uploadAdminImages,
} from '../controllers/adminController.js'
import {
  getAccountOverview,
  getAccountProfile,
  getAddressById,
  createAddress,
  deleteAddress,
  listAddresses,
  listInbox,
  listOrders,
  listWishlist,
  addWishlistItem,
  deleteWishlistItem,
  updateAddress,
  updateAccountProfile,
} from '../controllers/accountController.js'

const router = Router()

router.get('/health', getHealth)

router.post('/auth/signup', signupUser)
router.post('/auth/login', loginUser)
router.get('/auth/me', requireAuth, getAuthUser)

router.post('/admin/auth/signup', signupAdmin)
router.post('/admin/auth/login', loginAdmin)
router.get('/admin/auth/me', requireAuth, requireRole('Administrator'), getAuthUser)

router.get('/admin/dashboard', requireAuth, requireRole('Administrator'), getDashboard)
router.route('/admin/products').get(requireAuth, requireRole('Administrator'), listAdminProducts).post(requireAuth, requireRole('Administrator'), createAdminProduct)
router.route('/admin/products/:id').get(requireAuth, requireRole('Administrator'), getAdminProduct).put(requireAuth, requireRole('Administrator'), updateAdminProduct).delete(requireAuth, requireRole('Administrator'), deleteAdminProduct)
router.route('/admin/posts').get(requireAuth, requireRole('Administrator'), listAdminPosts).post(requireAuth, requireRole('Administrator'), createAdminPost)
router.route('/admin/posts/:id').get(requireAuth, requireRole('Administrator'), getAdminPost).put(requireAuth, requireRole('Administrator'), updateAdminPost).delete(requireAuth, requireRole('Administrator'), deleteAdminPost)
router.route('/admin/research-items').get(requireAuth, requireRole('Administrator'), listAdminResearchItems).post(requireAuth, requireRole('Administrator'), createAdminResearchItem)
router.route('/admin/research-items/:id').put(requireAuth, requireRole('Administrator'), updateAdminResearchItem).delete(requireAuth, requireRole('Administrator'), deleteAdminResearchItem)
router.route('/admin/library-items').get(requireAuth, requireRole('Administrator'), listAdminLibraryItems).post(requireAuth, requireRole('Administrator'), createAdminLibraryItem)
router.route('/admin/library-items/:id').put(requireAuth, requireRole('Administrator'), updateAdminLibraryItem).delete(requireAuth, requireRole('Administrator'), deleteAdminLibraryItem)
router.route('/admin/users').get(requireAuth, requireRole('Administrator'), listAdminUsers).post(requireAuth, requireRole('Administrator'), createAdminUser)
router.route('/admin/users/:id').put(requireAuth, requireRole('Administrator'), updateAdminUser).delete(requireAuth, requireRole('Administrator'), deleteAdminUser)
router.get('/admin/categories', requireAuth, requireRole('Administrator'), listAdminCategories)
router.get('/admin/tags', requireAuth, requireRole('Administrator'), listAdminTags)

router.route('/products').get(listProducts).post(requireAuth, requireRole('Administrator'), createProduct)
router.get('/products/:id', getProduct)
router.route('/products/:id').put(requireAuth, requireRole('Administrator'), updateProduct).delete(requireAuth, requireRole('Administrator'), deleteProduct)
router.route('/posts').get(listPosts).post(requireAuth, requireRole('Administrator'), createPost)
router.get('/posts/:id', getPost)
router.route('/posts/:id').put(requireAuth, requireRole('Administrator'), updatePost).delete(requireAuth, requireRole('Administrator'), deletePost)
router.get('/research-items', listResearchItems)
router.get('/library-items', listLibraryItems)

router.get('/users', requireAuth, requireRole('Administrator'), listUsers)
router.get('/categories', listCategories)
router.get('/tags', listTags)

router.post('/uploads/image', requireAuth, requireRole('Administrator'), upload.single('image'), uploadAdminImage)
router.post('/admin/uploads/image', requireAuth, requireRole('Administrator'), upload.single('image'), uploadAdminImage)
router.post('/uploads/images', requireAuth, requireRole('Administrator'), upload.array('images', 10), uploadAdminImages)
router.post('/admin/uploads/images', requireAuth, requireRole('Administrator'), upload.array('images', 10), uploadAdminImages)

router.get('/account', requireAuth, getAccountOverview)
router.get('/account/profile', requireAuth, getAccountProfile)
router.patch('/account/profile', requireAuth, updateAccountProfile)
router.get('/account/addresses', requireAuth, listAddresses)
router.post('/account/addresses', requireAuth, createAddress)
router.get('/account/addresses/:id', requireAuth, getAddressById)
router.put('/account/addresses/:id', requireAuth, updateAddress)
router.delete('/account/addresses/:id', requireAuth, deleteAddress)
router.get('/account/wishlist', requireAuth, listWishlist)
router.post('/account/wishlist', requireAuth, addWishlistItem)
router.delete('/account/wishlist/:id', requireAuth, deleteWishlistItem)
router.get('/account/inbox', requireAuth, listInbox)
router.get('/account/orders', requireAuth, listOrders)

router.patch('/auth/password', requireAuth, changePassword)

router.post('/payments/paystack/verify', verifyPaystackPayment)

export default router
