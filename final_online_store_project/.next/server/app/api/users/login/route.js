/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/users/login/route";
exports.ids = ["app/api/users/login/route"];
exports.modules = {

/***/ "(rsc)/./app/api/users/login/route.ts":
/*!**************************************!*\
  !*** ./app/api/users/login/route.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _lib_mongoose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/mongoose */ \"(rsc)/./lib/mongoose.ts\");\n/* harmony import */ var _models_User__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/models/User */ \"(rsc)/./models/User.ts\");\n// app/api/users/login/route.ts\n\n\n\n\n\nasync function POST(req) {\n    await (0,_lib_mongoose__WEBPACK_IMPORTED_MODULE_3__[\"default\"])();\n    const { email, password } = await req.json();\n    const user = await _models_User__WEBPACK_IMPORTED_MODULE_4__[\"default\"].findOne({\n        email\n    });\n    if (!user) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Email não encontrado\"\n        }, {\n            status: 401\n        });\n    }\n    const senhaOk = await bcryptjs__WEBPACK_IMPORTED_MODULE_1__[\"default\"].compare(password, user.password);\n    if (!senhaOk) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Senha incorreta\"\n        }, {\n            status: 401\n        });\n    }\n    // remove senha do usuário\n    const userObj = user.toObject();\n    delete userObj.password;\n    // gera o token (JWS)\n    const token = jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default().sign({\n        sub: user._id,\n        name: user.name,\n        email: user.email\n    }, process.env.JWT_SECRET, {\n        expiresIn: \"2h\"\n    });\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        user: userObj,\n        token\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3VzZXJzL2xvZ2luL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwrQkFBK0I7QUFFVztBQUNiO0FBQ0M7QUFDUTtBQUNOO0FBRXpCLGVBQWVLLEtBQUtDLEdBQVk7SUFDckMsTUFBTUgseURBQVNBO0lBQ2YsTUFBTSxFQUFFSSxLQUFLLEVBQUVDLFFBQVEsRUFBRSxHQUFHLE1BQU1GLElBQUlHLElBQUk7SUFFMUMsTUFBTUMsT0FBTyxNQUFNTixvREFBSUEsQ0FBQ08sT0FBTyxDQUFDO1FBQUVKO0lBQU07SUFDeEMsSUFBSSxDQUFDRyxNQUFNO1FBQ1QsT0FBT1YscURBQVlBLENBQUNTLElBQUksQ0FBQztZQUFFRyxTQUFTO1FBQXVCLEdBQUc7WUFBRUMsUUFBUTtRQUFJO0lBQzlFO0lBRUEsTUFBTUMsVUFBVSxNQUFNYix3REFBYyxDQUFDTyxVQUFVRSxLQUFLRixRQUFRO0lBQzVELElBQUksQ0FBQ00sU0FBUztRQUNaLE9BQU9kLHFEQUFZQSxDQUFDUyxJQUFJLENBQUM7WUFBRUcsU0FBUztRQUFrQixHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUN6RTtJQUVBLDBCQUEwQjtJQUMxQixNQUFNRyxVQUFVTixLQUFLTyxRQUFRO0lBQzdCLE9BQU9ELFFBQVFSLFFBQVE7SUFFdkIscUJBQXFCO0lBQ3JCLE1BQU1VLFFBQVFoQix3REFBUSxDQUNwQjtRQUFFa0IsS0FBS1YsS0FBS1csR0FBRztRQUFFQyxNQUFNWixLQUFLWSxJQUFJO1FBQUVmLE9BQU9HLEtBQUtILEtBQUs7SUFBQyxHQUNwRGdCLFFBQVFDLEdBQUcsQ0FBQ0MsVUFBVSxFQUN0QjtRQUFFQyxXQUFXO0lBQUs7SUFHcEIsT0FBTzFCLHFEQUFZQSxDQUFDUyxJQUFJLENBQUM7UUFBRUMsTUFBTU07UUFBU0U7SUFBTTtBQUNsRCIsInNvdXJjZXMiOlsiL2hvbWUvcGVsb3JvL0Rlc2t0b3AvQ29uZG9taW5pby9vbmxpbmVfc3RvcmVfcHJvamVjdC9maW5hbF9vbmxpbmVfc3RvcmVfcHJvamVjdC9hcHAvYXBpL3VzZXJzL2xvZ2luL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGFwcC9hcGkvdXNlcnMvbG9naW4vcm91dGUudHNcblxuaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCJcbmltcG9ydCBiY3J5cHQgZnJvbSBcImJjcnlwdGpzXCJcbmltcG9ydCBqd3QgZnJvbSBcImpzb253ZWJ0b2tlblwiXG5pbXBvcnQgY29ubmVjdERCIGZyb20gXCJAL2xpYi9tb25nb29zZVwiXG5pbXBvcnQgVXNlciBmcm9tIFwiQC9tb2RlbHMvVXNlclwiXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcTogUmVxdWVzdCkge1xuICBhd2FpdCBjb25uZWN0REIoKVxuICBjb25zdCB7IGVtYWlsLCBwYXNzd29yZCB9ID0gYXdhaXQgcmVxLmpzb24oKVxuXG4gIGNvbnN0IHVzZXIgPSBhd2FpdCBVc2VyLmZpbmRPbmUoeyBlbWFpbCB9KVxuICBpZiAoIXVzZXIpIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBtZXNzYWdlOiBcIkVtYWlsIG7Do28gZW5jb250cmFkb1wiIH0sIHsgc3RhdHVzOiA0MDEgfSlcbiAgfVxuXG4gIGNvbnN0IHNlbmhhT2sgPSBhd2FpdCBiY3J5cHQuY29tcGFyZShwYXNzd29yZCwgdXNlci5wYXNzd29yZClcbiAgaWYgKCFzZW5oYU9rKSB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgbWVzc2FnZTogXCJTZW5oYSBpbmNvcnJldGFcIiB9LCB7IHN0YXR1czogNDAxIH0pXG4gIH1cblxuICAvLyByZW1vdmUgc2VuaGEgZG8gdXN1w6FyaW9cbiAgY29uc3QgdXNlck9iaiA9IHVzZXIudG9PYmplY3QoKVxuICBkZWxldGUgdXNlck9iai5wYXNzd29yZFxuXG4gIC8vIGdlcmEgbyB0b2tlbiAoSldTKVxuICBjb25zdCB0b2tlbiA9IGp3dC5zaWduKFxuICAgIHsgc3ViOiB1c2VyLl9pZCwgbmFtZTogdXNlci5uYW1lLCBlbWFpbDogdXNlci5lbWFpbCB9LFxuICAgIHByb2Nlc3MuZW52LkpXVF9TRUNSRVQgYXMgc3RyaW5nLFxuICAgIHsgZXhwaXJlc0luOiBcIjJoXCIgfVxuICApXG5cbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgdXNlcjogdXNlck9iaiwgdG9rZW4gfSlcbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJiY3J5cHQiLCJqd3QiLCJjb25uZWN0REIiLCJVc2VyIiwiUE9TVCIsInJlcSIsImVtYWlsIiwicGFzc3dvcmQiLCJqc29uIiwidXNlciIsImZpbmRPbmUiLCJtZXNzYWdlIiwic3RhdHVzIiwic2VuaGFPayIsImNvbXBhcmUiLCJ1c2VyT2JqIiwidG9PYmplY3QiLCJ0b2tlbiIsInNpZ24iLCJzdWIiLCJfaWQiLCJuYW1lIiwicHJvY2VzcyIsImVudiIsIkpXVF9TRUNSRVQiLCJleHBpcmVzSW4iXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/users/login/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/mongoose.ts":
/*!*************************!*\
  !*** ./lib/mongoose.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst MONGODB_URI = process.env.MONGODB_URI;\nif (!MONGODB_URI) {\n    throw new Error('❌ MONGODB_URI não está definida no .env');\n}\n// cache para evitar reconexões no dev\nlet cached = global.mongoose || {\n    conn: null,\n    promise: null\n};\nasync function connectDB() {\n    if (cached.conn) return cached.conn;\n    if (!cached.promise) {\n        cached.promise = mongoose__WEBPACK_IMPORTED_MODULE_0___default().connect(MONGODB_URI, {\n            bufferCommands: false\n        });\n    }\n    cached.conn = await cached.promise;\n    return cached.conn;\n}\nglobal.mongoose = cached;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (connectDB);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvbW9uZ29vc2UudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQStCO0FBRS9CLE1BQU1DLGNBQWNDLFFBQVFDLEdBQUcsQ0FBQ0YsV0FBVztBQUUzQyxJQUFJLENBQUNBLGFBQWE7SUFDaEIsTUFBTSxJQUFJRyxNQUFNO0FBQ2xCO0FBRUEsc0NBQXNDO0FBQ3RDLElBQUlDLFNBQVNDLE9BQU9OLFFBQVEsSUFBSTtJQUFFTyxNQUFNO0lBQU1DLFNBQVM7QUFBSztBQUU1RCxlQUFlQztJQUNiLElBQUlKLE9BQU9FLElBQUksRUFBRSxPQUFPRixPQUFPRSxJQUFJO0lBRW5DLElBQUksQ0FBQ0YsT0FBT0csT0FBTyxFQUFFO1FBQ25CSCxPQUFPRyxPQUFPLEdBQUdSLHVEQUFnQixDQUFDQyxhQUFhO1lBQzdDVSxnQkFBZ0I7UUFDbEI7SUFDRjtJQUVBTixPQUFPRSxJQUFJLEdBQUcsTUFBTUYsT0FBT0csT0FBTztJQUNsQyxPQUFPSCxPQUFPRSxJQUFJO0FBQ3BCO0FBUUFELE9BQU9OLFFBQVEsR0FBR0s7QUFFbEIsaUVBQWVJLFNBQVNBLEVBQUEiLCJzb3VyY2VzIjpbIi9ob21lL3BlbG9yby9EZXNrdG9wL0NvbmRvbWluaW8vb25saW5lX3N0b3JlX3Byb2plY3QvZmluYWxfb25saW5lX3N0b3JlX3Byb2plY3QvbGliL21vbmdvb3NlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSdcblxuY29uc3QgTU9OR09EQl9VUkkgPSBwcm9jZXNzLmVudi5NT05HT0RCX1VSSSBhcyBzdHJpbmdcblxuaWYgKCFNT05HT0RCX1VSSSkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ+KdjCBNT05HT0RCX1VSSSBuw6NvIGVzdMOhIGRlZmluaWRhIG5vIC5lbnYnKVxufVxuXG4vLyBjYWNoZSBwYXJhIGV2aXRhciByZWNvbmV4w7VlcyBubyBkZXZcbmxldCBjYWNoZWQgPSBnbG9iYWwubW9uZ29vc2UgfHwgeyBjb25uOiBudWxsLCBwcm9taXNlOiBudWxsIH1cblxuYXN5bmMgZnVuY3Rpb24gY29ubmVjdERCKCkge1xuICBpZiAoY2FjaGVkLmNvbm4pIHJldHVybiBjYWNoZWQuY29ublxuXG4gIGlmICghY2FjaGVkLnByb21pc2UpIHtcbiAgICBjYWNoZWQucHJvbWlzZSA9IG1vbmdvb3NlLmNvbm5lY3QoTU9OR09EQl9VUkksIHtcbiAgICAgIGJ1ZmZlckNvbW1hbmRzOiBmYWxzZSxcbiAgICB9KVxuICB9XG5cbiAgY2FjaGVkLmNvbm4gPSBhd2FpdCBjYWNoZWQucHJvbWlzZVxuICByZXR1cm4gY2FjaGVkLmNvbm5cbn1cblxuLy8gZGVmaW5pw6fDo28gZ2xvYmFsIHByYSBuw6NvIHJlY3JpYXIgbm8gaG90IHJlbG9hZFxuZGVjbGFyZSBnbG9iYWwge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdmFyXG4gIHZhciBtb25nb29zZTogYW55XG59XG5cbmdsb2JhbC5tb25nb29zZSA9IGNhY2hlZFxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0REIiXSwibmFtZXMiOlsibW9uZ29vc2UiLCJNT05HT0RCX1VSSSIsInByb2Nlc3MiLCJlbnYiLCJFcnJvciIsImNhY2hlZCIsImdsb2JhbCIsImNvbm4iLCJwcm9taXNlIiwiY29ubmVjdERCIiwiY29ubmVjdCIsImJ1ZmZlckNvbW1hbmRzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/mongoose.ts\n");

/***/ }),

/***/ "(rsc)/./models/CartItemSchema.ts":
/*!**********************************!*\
  !*** ./models/CartItemSchema.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CartItemSchema: () => (/* binding */ CartItemSchema),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst CartItemSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema({\n    product: {\n        type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,\n        ref: 'Product',\n        required: true\n    },\n    quantity: {\n        type: Number,\n        required: true,\n        min: 1\n    }\n}, {\n    timestamps: true\n});\nconst CartItem = mongoose__WEBPACK_IMPORTED_MODULE_0__.models.CartItem || (0,mongoose__WEBPACK_IMPORTED_MODULE_0__.model)('CartItem', CartItemSchema);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CartItem);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9tb2RlbHMvQ2FydEl0ZW1TY2hlbWEudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUEwRDtBQUUxRCxNQUFNRyxpQkFBaUIsSUFBSUgsNENBQU1BLENBQUM7SUFDaENJLFNBQVM7UUFDUEMsTUFBTUwsNENBQU1BLENBQUNNLEtBQUssQ0FBQ0MsUUFBUTtRQUMzQkMsS0FBSztRQUNMQyxVQUFVO0lBQ1o7SUFDQUMsVUFBVTtRQUNSTCxNQUFNTTtRQUNORixVQUFVO1FBQ1ZHLEtBQUs7SUFDUDtBQUNGLEdBQUc7SUFDREMsWUFBWTtBQUNkO0FBRUEsTUFBTUMsV0FBV1osNENBQU1BLENBQUNZLFFBQVEsSUFBSWIsK0NBQUtBLENBQUMsWUFBWUU7QUFDdEQsaUVBQWVXLFFBQVFBLEVBQUE7QUFDRSIsInNvdXJjZXMiOlsiL2hvbWUvcGVsb3JvL0Rlc2t0b3AvQ29uZG9taW5pby9vbmxpbmVfc3RvcmVfcHJvamVjdC9maW5hbF9vbmxpbmVfc3RvcmVfcHJvamVjdC9tb2RlbHMvQ2FydEl0ZW1TY2hlbWEudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbmdvb3NlLCB7IFNjaGVtYSwgbW9kZWwsIG1vZGVscyB9IGZyb20gJ21vbmdvb3NlJ1xuXG5jb25zdCBDYXJ0SXRlbVNjaGVtYSA9IG5ldyBTY2hlbWEoe1xuICBwcm9kdWN0OiB7XG4gICAgdHlwZTogU2NoZW1hLlR5cGVzLk9iamVjdElkLFxuICAgIHJlZjogJ1Byb2R1Y3QnLFxuICAgIHJlcXVpcmVkOiB0cnVlXG4gIH0sXG4gIHF1YW50aXR5OiB7XG4gICAgdHlwZTogTnVtYmVyLFxuICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIG1pbjogMVxuICB9XG59LCB7XG4gIHRpbWVzdGFtcHM6IHRydWVcbn0pXG5cbmNvbnN0IENhcnRJdGVtID0gbW9kZWxzLkNhcnRJdGVtIHx8IG1vZGVsKCdDYXJ0SXRlbScsIENhcnRJdGVtU2NoZW1hKVxuZXhwb3J0IGRlZmF1bHQgQ2FydEl0ZW1cbmV4cG9ydCB7IENhcnRJdGVtU2NoZW1hIH0iXSwibmFtZXMiOlsiU2NoZW1hIiwibW9kZWwiLCJtb2RlbHMiLCJDYXJ0SXRlbVNjaGVtYSIsInByb2R1Y3QiLCJ0eXBlIiwiVHlwZXMiLCJPYmplY3RJZCIsInJlZiIsInJlcXVpcmVkIiwicXVhbnRpdHkiLCJOdW1iZXIiLCJtaW4iLCJ0aW1lc3RhbXBzIiwiQ2FydEl0ZW0iXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./models/CartItemSchema.ts\n");

/***/ }),

/***/ "(rsc)/./models/User.ts":
/*!************************!*\
  !*** ./models/User.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _CartItemSchema__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CartItemSchema */ \"(rsc)/./models/CartItemSchema.ts\");\n\n\nconst OrderItemSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema({\n    product: {\n        type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,\n        ref: 'Product',\n        required: true\n    },\n    quantity: {\n        type: Number,\n        required: true,\n        min: 1\n    },\n    price: {\n        type: Number,\n        required: true,\n        min: 0\n    }\n});\nconst OrderSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema({\n    orderCode: {\n        type: String,\n        required: true\n    },\n    items: [\n        OrderItemSchema\n    ],\n    total: {\n        type: Number,\n        required: true,\n        min: 0\n    },\n    paymentMethod: {\n        type: Object,\n        required: true\n    },\n    status: {\n        type: String,\n        enum: [\n            'pending',\n            'completed',\n            'cancelled'\n        ],\n        default: 'pending'\n    },\n    createdAt: {\n        type: Date,\n        default: Date.now\n    }\n});\nconst UserSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema({\n    name: {\n        type: String,\n        required: true\n    },\n    email: {\n        type: String,\n        required: true,\n        unique: true\n    },\n    apartment: {\n        type: String,\n        required: true\n    },\n    password: {\n        type: String,\n        required: true\n    },\n    admin: {\n        type: Boolean,\n        default: false\n    },\n    paymentMethod: {\n        type: Object,\n        default: null\n    },\n    cart: [\n        _CartItemSchema__WEBPACK_IMPORTED_MODULE_1__.CartItemSchema\n    ],\n    order: [\n        OrderSchema\n    ]\n}, {\n    timestamps: true\n});\n// evita redefinir o model no hot-reload do Next.js\nconst User = mongoose__WEBPACK_IMPORTED_MODULE_0__.models.User || (0,mongoose__WEBPACK_IMPORTED_MODULE_0__.model)('User', UserSchema);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (User);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9tb2RlbHMvVXNlci50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQTBEO0FBQ1Q7QUFFakQsTUFBTUksa0JBQWtCLElBQUlKLDRDQUFNQSxDQUFDO0lBQ2pDSyxTQUFTO1FBQ1BDLE1BQU1OLDRDQUFNQSxDQUFDTyxLQUFLLENBQUNDLFFBQVE7UUFDM0JDLEtBQUs7UUFDTEMsVUFBVTtJQUNaO0lBQ0FDLFVBQVU7UUFDUkwsTUFBTU07UUFDTkYsVUFBVTtRQUNWRyxLQUFLO0lBQ1A7SUFDQUMsT0FBTztRQUNMUixNQUFNTTtRQUNORixVQUFVO1FBQ1ZHLEtBQUs7SUFDUDtBQUNGO0FBRUEsTUFBTUUsY0FBYyxJQUFJZiw0Q0FBTUEsQ0FBQztJQUM3QmdCLFdBQVc7UUFDVFYsTUFBTVc7UUFDTlAsVUFBVTtJQUNaO0lBQ0FRLE9BQU87UUFBQ2Q7S0FBZ0I7SUFDeEJlLE9BQU87UUFDTGIsTUFBTU07UUFDTkYsVUFBVTtRQUNWRyxLQUFLO0lBQ1A7SUFDQU8sZUFBZTtRQUNiZCxNQUFNZTtRQUNOWCxVQUFVO0lBQ1o7SUFDQVksUUFBUTtRQUNOaEIsTUFBTVc7UUFDTk0sTUFBTTtZQUFDO1lBQVc7WUFBYTtTQUFZO1FBQzNDQyxTQUFTO0lBQ1g7SUFDQUMsV0FBVztRQUNUbkIsTUFBTW9CO1FBQ05GLFNBQVNFLEtBQUtDLEdBQUc7SUFDbkI7QUFDRjtBQUVBLE1BQU1DLGFBQWEsSUFBSTVCLDRDQUFNQSxDQUFDO0lBQzVCNkIsTUFBTTtRQUNKdkIsTUFBTVc7UUFDTlAsVUFBVTtJQUNaO0lBQ0FvQixPQUFPO1FBQ0x4QixNQUFNVztRQUNOUCxVQUFVO1FBQ1ZxQixRQUFRO0lBQ1Y7SUFDQUMsV0FBVztRQUNUMUIsTUFBTVc7UUFDTlAsVUFBVTtJQUNaO0lBQ0F1QixVQUFVO1FBQ1IzQixNQUFNVztRQUNOUCxVQUFVO0lBQ1o7SUFDQXdCLE9BQU87UUFDTDVCLE1BQU02QjtRQUNOWCxTQUFTO0lBQ1g7SUFDQUosZUFBZTtRQUNiZCxNQUFNZTtRQUNORyxTQUFTO0lBQ1g7SUFDQVksTUFBTTtRQUFDakMsMkRBQWNBO0tBQUM7SUFDdEJrQyxPQUFPO1FBQUN0QjtLQUFZO0FBQ3RCLEdBQUc7SUFDRHVCLFlBQVk7QUFDZDtBQUVBLG1EQUFtRDtBQUNuRCxNQUFNQyxPQUFPckMsNENBQU1BLENBQUNxQyxJQUFJLElBQUl0QywrQ0FBS0EsQ0FBQyxRQUFRMkI7QUFDMUMsaUVBQWVXLElBQUlBLEVBQUEiLCJzb3VyY2VzIjpbIi9ob21lL3BlbG9yby9EZXNrdG9wL0NvbmRvbWluaW8vb25saW5lX3N0b3JlX3Byb2plY3QvZmluYWxfb25saW5lX3N0b3JlX3Byb2plY3QvbW9kZWxzL1VzZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbmdvb3NlLCB7IFNjaGVtYSwgbW9kZWwsIG1vZGVscyB9IGZyb20gJ21vbmdvb3NlJ1xuaW1wb3J0IHsgQ2FydEl0ZW1TY2hlbWEgfSBmcm9tICcuL0NhcnRJdGVtU2NoZW1hJ1xuXG5jb25zdCBPcmRlckl0ZW1TY2hlbWEgPSBuZXcgU2NoZW1hKHtcbiAgcHJvZHVjdDoge1xuICAgIHR5cGU6IFNjaGVtYS5UeXBlcy5PYmplY3RJZCxcbiAgICByZWY6ICdQcm9kdWN0JyxcbiAgICByZXF1aXJlZDogdHJ1ZVxuICB9LFxuICBxdWFudGl0eToge1xuICAgIHR5cGU6IE51bWJlcixcbiAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICBtaW46IDFcbiAgfSxcbiAgcHJpY2U6IHtcbiAgICB0eXBlOiBOdW1iZXIsXG4gICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgbWluOiAwXG4gIH1cbn0pXG5cbmNvbnN0IE9yZGVyU2NoZW1hID0gbmV3IFNjaGVtYSh7XG4gIG9yZGVyQ29kZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZXF1aXJlZDogdHJ1ZVxuICB9LFxuICBpdGVtczogW09yZGVySXRlbVNjaGVtYV0sXG4gIHRvdGFsOiB7XG4gICAgdHlwZTogTnVtYmVyLFxuICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIG1pbjogMFxuICB9LFxuICBwYXltZW50TWV0aG9kOiB7XG4gICAgdHlwZTogT2JqZWN0LFxuICAgIHJlcXVpcmVkOiB0cnVlXG4gIH0sXG4gIHN0YXR1czoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBlbnVtOiBbJ3BlbmRpbmcnLCAnY29tcGxldGVkJywgJ2NhbmNlbGxlZCddLFxuICAgIGRlZmF1bHQ6ICdwZW5kaW5nJ1xuICB9LFxuICBjcmVhdGVkQXQ6IHtcbiAgICB0eXBlOiBEYXRlLFxuICAgIGRlZmF1bHQ6IERhdGUubm93XG4gIH1cbn0pXG5cbmNvbnN0IFVzZXJTY2hlbWEgPSBuZXcgU2NoZW1hKHtcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZXF1aXJlZDogdHJ1ZVxuICB9LFxuICBlbWFpbDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICB1bmlxdWU6IHRydWVcbiAgfSxcbiAgYXBhcnRtZW50OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlcXVpcmVkOiB0cnVlXG4gIH0sXG4gIHBhc3N3b3JkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlcXVpcmVkOiB0cnVlXG4gIH0sXG4gIGFkbWluOiB7XG4gICAgdHlwZTogQm9vbGVhbixcbiAgICBkZWZhdWx0OiBmYWxzZVxuICB9LFxuICBwYXltZW50TWV0aG9kOiB7XG4gICAgdHlwZTogT2JqZWN0LFxuICAgIGRlZmF1bHQ6IG51bGxcbiAgfSxcbiAgY2FydDogW0NhcnRJdGVtU2NoZW1hXSwgLy8gQWRpY2lvbmFyIGNhcnJpbmhvIGFvIHVzdcOhcmlvXG4gIG9yZGVyOiBbT3JkZXJTY2hlbWFdXG59LCB7XG4gIHRpbWVzdGFtcHM6IHRydWVcbn0pXG5cbi8vIGV2aXRhIHJlZGVmaW5pciBvIG1vZGVsIG5vIGhvdC1yZWxvYWQgZG8gTmV4dC5qc1xuY29uc3QgVXNlciA9IG1vZGVscy5Vc2VyIHx8IG1vZGVsKCdVc2VyJywgVXNlclNjaGVtYSlcbmV4cG9ydCBkZWZhdWx0IFVzZXIiXSwibmFtZXMiOlsiU2NoZW1hIiwibW9kZWwiLCJtb2RlbHMiLCJDYXJ0SXRlbVNjaGVtYSIsIk9yZGVySXRlbVNjaGVtYSIsInByb2R1Y3QiLCJ0eXBlIiwiVHlwZXMiLCJPYmplY3RJZCIsInJlZiIsInJlcXVpcmVkIiwicXVhbnRpdHkiLCJOdW1iZXIiLCJtaW4iLCJwcmljZSIsIk9yZGVyU2NoZW1hIiwib3JkZXJDb2RlIiwiU3RyaW5nIiwiaXRlbXMiLCJ0b3RhbCIsInBheW1lbnRNZXRob2QiLCJPYmplY3QiLCJzdGF0dXMiLCJlbnVtIiwiZGVmYXVsdCIsImNyZWF0ZWRBdCIsIkRhdGUiLCJub3ciLCJVc2VyU2NoZW1hIiwibmFtZSIsImVtYWlsIiwidW5pcXVlIiwiYXBhcnRtZW50IiwicGFzc3dvcmQiLCJhZG1pbiIsIkJvb2xlYW4iLCJjYXJ0Iiwib3JkZXIiLCJ0aW1lc3RhbXBzIiwiVXNlciJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./models/User.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fusers%2Flogin%2Froute&page=%2Fapi%2Fusers%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fusers%2Flogin%2Froute.ts&appDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fusers%2Flogin%2Froute&page=%2Fapi%2Fusers%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fusers%2Flogin%2Froute.ts&appDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_peloro_Desktop_Condominio_online_store_project_final_online_store_project_app_api_users_login_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/users/login/route.ts */ \"(rsc)/./app/api/users/login/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/users/login/route\",\n        pathname: \"/api/users/login\",\n        filename: \"route\",\n        bundlePath: \"app/api/users/login/route\"\n    },\n    resolvedPagePath: \"/home/peloro/Desktop/Condominio/online_store_project/final_online_store_project/app/api/users/login/route.ts\",\n    nextConfigOutput,\n    userland: _home_peloro_Desktop_Condominio_online_store_project_final_online_store_project_app_api_users_login_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZ1c2VycyUyRmxvZ2luJTJGcm91dGUmcGFnZT0lMkZhcGklMkZ1c2VycyUyRmxvZ2luJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGdXNlcnMlMkZsb2dpbiUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGcGVsb3JvJTJGRGVza3RvcCUyRkNvbmRvbWluaW8lMkZvbmxpbmVfc3RvcmVfcHJvamVjdCUyRmZpbmFsX29ubGluZV9zdG9yZV9wcm9qZWN0JTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZob21lJTJGcGVsb3JvJTJGRGVza3RvcCUyRkNvbmRvbWluaW8lMkZvbmxpbmVfc3RvcmVfcHJvamVjdCUyRmZpbmFsX29ubGluZV9zdG9yZV9wcm9qZWN0JmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUM0RDtBQUN6STtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL2hvbWUvcGVsb3JvL0Rlc2t0b3AvQ29uZG9taW5pby9vbmxpbmVfc3RvcmVfcHJvamVjdC9maW5hbF9vbmxpbmVfc3RvcmVfcHJvamVjdC9hcHAvYXBpL3VzZXJzL2xvZ2luL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS91c2Vycy9sb2dpbi9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3VzZXJzL2xvZ2luXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS91c2Vycy9sb2dpbi9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9ob21lL3BlbG9yby9EZXNrdG9wL0NvbmRvbWluaW8vb25saW5lX3N0b3JlX3Byb2plY3QvZmluYWxfb25saW5lX3N0b3JlX3Byb2plY3QvYXBwL2FwaS91c2Vycy9sb2dpbi9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fusers%2Flogin%2Froute&page=%2Fapi%2Fusers%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fusers%2Flogin%2Froute.ts&appDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("mongoose");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/ms","vendor-chunks/semver","vendor-chunks/jsonwebtoken","vendor-chunks/lodash.includes","vendor-chunks/jws","vendor-chunks/lodash.once","vendor-chunks/jwa","vendor-chunks/lodash.isinteger","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/lodash.isplainobject","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isboolean","vendor-chunks/safe-buffer","vendor-chunks/buffer-equal-constant-time","vendor-chunks/bcryptjs"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fusers%2Flogin%2Froute&page=%2Fapi%2Fusers%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fusers%2Flogin%2Froute.ts&appDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();