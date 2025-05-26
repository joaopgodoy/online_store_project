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
exports.id = "app/api/upload/route";
exports.ids = ["app/api/upload/route"];
exports.modules = {

/***/ "(rsc)/./app/api/upload/route.ts":
/*!*********************************!*\
  !*** ./app/api/upload/route.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var fs_promises__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs/promises */ \"fs/promises\");\n/* harmony import */ var fs_promises__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs_promises__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nasync function POST(request) {\n    try {\n        const data = await request.formData();\n        const file = data.get('file');\n        if (!file) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: 'Nenhum arquivo enviado'\n            }, {\n                status: 400\n            });\n        }\n        // Validar tipo de arquivo\n        const allowedTypes = [\n            'image/jpeg',\n            'image/jpg',\n            'image/png',\n            'image/webp'\n        ];\n        if (!allowedTypes.includes(file.type)) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: 'Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.'\n            }, {\n                status: 400\n            });\n        }\n        // Validar tamanho do arquivo (5MB máximo)\n        const maxSize = 5 * 1024 * 1024 // 5MB\n        ;\n        if (file.size > maxSize) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: 'Arquivo muito grande. Tamanho máximo: 5MB'\n            }, {\n                status: 400\n            });\n        }\n        const bytes = await file.arrayBuffer();\n        const buffer = Buffer.from(bytes);\n        // Gerar nome único para o arquivo\n        const timestamp = Date.now();\n        const extension = path__WEBPACK_IMPORTED_MODULE_2___default().extname(file.name);\n        const filename = `product_${timestamp}${extension}`;\n        // Criar diretório se não existir\n        const uploadDir = path__WEBPACK_IMPORTED_MODULE_2___default().join(process.cwd(), 'public', 'products');\n        try {\n            await (0,fs_promises__WEBPACK_IMPORTED_MODULE_1__.mkdir)(uploadDir, {\n                recursive: true\n            });\n        } catch (error) {\n        // Diretório já existe\n        }\n        // Salvar arquivo\n        const filepath = path__WEBPACK_IMPORTED_MODULE_2___default().join(uploadDir, filename);\n        await (0,fs_promises__WEBPACK_IMPORTED_MODULE_1__.writeFile)(filepath, buffer);\n        // Retornar URL do arquivo\n        const fileUrl = `/products/${filename}`;\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: 'Arquivo enviado com sucesso',\n            url: fileUrl,\n            filename\n        });\n    } catch (error) {\n        console.error('Erro ao fazer upload:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: 'Erro interno do servidor'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3VwbG9hZC9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBdUQ7QUFDVDtBQUN2QjtBQUVoQixlQUFlSSxLQUFLQyxPQUFvQjtJQUM3QyxJQUFJO1FBQ0YsTUFBTUMsT0FBTyxNQUFNRCxRQUFRRSxRQUFRO1FBQ25DLE1BQU1DLE9BQW9CRixLQUFLRyxHQUFHLENBQUM7UUFFbkMsSUFBSSxDQUFDRCxNQUFNO1lBQ1QsT0FBT1IscURBQVlBLENBQUNVLElBQUksQ0FBQztnQkFBRUMsU0FBUztZQUF5QixHQUFHO2dCQUFFQyxRQUFRO1lBQUk7UUFDaEY7UUFFQSwwQkFBMEI7UUFDMUIsTUFBTUMsZUFBZTtZQUFDO1lBQWM7WUFBYTtZQUFhO1NBQWE7UUFDM0UsSUFBSSxDQUFDQSxhQUFhQyxRQUFRLENBQUNOLEtBQUtPLElBQUksR0FBRztZQUNyQyxPQUFPZixxREFBWUEsQ0FBQ1UsSUFBSSxDQUN0QjtnQkFBRUMsU0FBUztZQUF3RCxHQUNuRTtnQkFBRUMsUUFBUTtZQUFJO1FBRWxCO1FBRUEsMENBQTBDO1FBQzFDLE1BQU1JLFVBQVUsSUFBSSxPQUFPLEtBQUssTUFBTTs7UUFDdEMsSUFBSVIsS0FBS1MsSUFBSSxHQUFHRCxTQUFTO1lBQ3ZCLE9BQU9oQixxREFBWUEsQ0FBQ1UsSUFBSSxDQUN0QjtnQkFBRUMsU0FBUztZQUE0QyxHQUN2RDtnQkFBRUMsUUFBUTtZQUFJO1FBRWxCO1FBRUEsTUFBTU0sUUFBUSxNQUFNVixLQUFLVyxXQUFXO1FBQ3BDLE1BQU1DLFNBQVNDLE9BQU9DLElBQUksQ0FBQ0o7UUFFM0Isa0NBQWtDO1FBQ2xDLE1BQU1LLFlBQVlDLEtBQUtDLEdBQUc7UUFDMUIsTUFBTUMsWUFBWXZCLG1EQUFZLENBQUNLLEtBQUtvQixJQUFJO1FBQ3hDLE1BQU1DLFdBQVcsQ0FBQyxRQUFRLEVBQUVOLFlBQVlHLFdBQVc7UUFFbkQsaUNBQWlDO1FBQ2pDLE1BQU1JLFlBQVkzQixnREFBUyxDQUFDNkIsUUFBUUMsR0FBRyxJQUFJLFVBQVU7UUFDckQsSUFBSTtZQUNGLE1BQU0vQixrREFBS0EsQ0FBQzRCLFdBQVc7Z0JBQUVJLFdBQVc7WUFBSztRQUMzQyxFQUFFLE9BQU9DLE9BQU87UUFDZCxzQkFBc0I7UUFDeEI7UUFFQSxpQkFBaUI7UUFDakIsTUFBTUMsV0FBV2pDLGdEQUFTLENBQUMyQixXQUFXRDtRQUN0QyxNQUFNNUIsc0RBQVNBLENBQUNtQyxVQUFVaEI7UUFFMUIsMEJBQTBCO1FBQzFCLE1BQU1pQixVQUFVLENBQUMsVUFBVSxFQUFFUixVQUFVO1FBRXZDLE9BQU83QixxREFBWUEsQ0FBQ1UsSUFBSSxDQUFDO1lBQ3ZCQyxTQUFTO1lBQ1QyQixLQUFLRDtZQUNMUjtRQUNGO0lBRUYsRUFBRSxPQUFPTSxPQUFPO1FBQ2RJLFFBQVFKLEtBQUssQ0FBQyx5QkFBeUJBO1FBQ3ZDLE9BQU9uQyxxREFBWUEsQ0FBQ1UsSUFBSSxDQUN0QjtZQUFFQyxTQUFTO1FBQTJCLEdBQ3RDO1lBQUVDLFFBQVE7UUFBSTtJQUVsQjtBQUNGIiwic291cmNlcyI6WyIvaG9tZS9wZWxvcm8vRGVza3RvcC9Db25kb21pbmlvL29ubGluZV9zdG9yZV9wcm9qZWN0L2ZpbmFsX29ubGluZV9zdG9yZV9wcm9qZWN0L2FwcC9hcGkvdXBsb2FkL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcidcbmltcG9ydCB7IHdyaXRlRmlsZSwgbWtkaXIgfSBmcm9tICdmcy9wcm9taXNlcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcXVlc3QuZm9ybURhdGEoKVxuICAgIGNvbnN0IGZpbGU6IEZpbGUgfCBudWxsID0gZGF0YS5nZXQoJ2ZpbGUnKSBhcyB1bmtub3duIGFzIEZpbGVcblxuICAgIGlmICghZmlsZSkge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgbWVzc2FnZTogJ05lbmh1bSBhcnF1aXZvIGVudmlhZG8nIH0sIHsgc3RhdHVzOiA0MDAgfSlcbiAgICB9XG5cbiAgICAvLyBWYWxpZGFyIHRpcG8gZGUgYXJxdWl2b1xuICAgIGNvbnN0IGFsbG93ZWRUeXBlcyA9IFsnaW1hZ2UvanBlZycsICdpbWFnZS9qcGcnLCAnaW1hZ2UvcG5nJywgJ2ltYWdlL3dlYnAnXVxuICAgIGlmICghYWxsb3dlZFR5cGVzLmluY2x1ZGVzKGZpbGUudHlwZSkpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBtZXNzYWdlOiAnVGlwbyBkZSBhcnF1aXZvIG7Do28gcGVybWl0aWRvLiBVc2UgSlBFRywgUE5HIG91IFdlYlAuJyB9LFxuICAgICAgICB7IHN0YXR1czogNDAwIH1cbiAgICAgIClcbiAgICB9XG5cbiAgICAvLyBWYWxpZGFyIHRhbWFuaG8gZG8gYXJxdWl2byAoNU1CIG3DoXhpbW8pXG4gICAgY29uc3QgbWF4U2l6ZSA9IDUgKiAxMDI0ICogMTAyNCAvLyA1TUJcbiAgICBpZiAoZmlsZS5zaXplID4gbWF4U2l6ZSkge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IG1lc3NhZ2U6ICdBcnF1aXZvIG11aXRvIGdyYW5kZS4gVGFtYW5obyBtw6F4aW1vOiA1TUInIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDAgfVxuICAgICAgKVxuICAgIH1cblxuICAgIGNvbnN0IGJ5dGVzID0gYXdhaXQgZmlsZS5hcnJheUJ1ZmZlcigpXG4gICAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmZyb20oYnl0ZXMpXG5cbiAgICAvLyBHZXJhciBub21lIMO6bmljbyBwYXJhIG8gYXJxdWl2b1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KClcbiAgICBjb25zdCBleHRlbnNpb24gPSBwYXRoLmV4dG5hbWUoZmlsZS5uYW1lKVxuICAgIGNvbnN0IGZpbGVuYW1lID0gYHByb2R1Y3RfJHt0aW1lc3RhbXB9JHtleHRlbnNpb259YFxuXG4gICAgLy8gQ3JpYXIgZGlyZXTDs3JpbyBzZSBuw6NvIGV4aXN0aXJcbiAgICBjb25zdCB1cGxvYWREaXIgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3B1YmxpYycsICdwcm9kdWN0cycpXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IG1rZGlyKHVwbG9hZERpciwgeyByZWN1cnNpdmU6IHRydWUgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gRGlyZXTDs3JpbyBqw6EgZXhpc3RlXG4gICAgfVxuXG4gICAgLy8gU2FsdmFyIGFycXVpdm9cbiAgICBjb25zdCBmaWxlcGF0aCA9IHBhdGguam9pbih1cGxvYWREaXIsIGZpbGVuYW1lKVxuICAgIGF3YWl0IHdyaXRlRmlsZShmaWxlcGF0aCwgYnVmZmVyKVxuXG4gICAgLy8gUmV0b3JuYXIgVVJMIGRvIGFycXVpdm9cbiAgICBjb25zdCBmaWxlVXJsID0gYC9wcm9kdWN0cy8ke2ZpbGVuYW1lfWBcblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XG4gICAgICBtZXNzYWdlOiAnQXJxdWl2byBlbnZpYWRvIGNvbSBzdWNlc3NvJyxcbiAgICAgIHVybDogZmlsZVVybCxcbiAgICAgIGZpbGVuYW1lXG4gICAgfSlcblxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm8gYW8gZmF6ZXIgdXBsb2FkOicsIGVycm9yKVxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHsgbWVzc2FnZTogJ0Vycm8gaW50ZXJubyBkbyBzZXJ2aWRvcicgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgIClcbiAgfVxufSJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJ3cml0ZUZpbGUiLCJta2RpciIsInBhdGgiLCJQT1NUIiwicmVxdWVzdCIsImRhdGEiLCJmb3JtRGF0YSIsImZpbGUiLCJnZXQiLCJqc29uIiwibWVzc2FnZSIsInN0YXR1cyIsImFsbG93ZWRUeXBlcyIsImluY2x1ZGVzIiwidHlwZSIsIm1heFNpemUiLCJzaXplIiwiYnl0ZXMiLCJhcnJheUJ1ZmZlciIsImJ1ZmZlciIsIkJ1ZmZlciIsImZyb20iLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93IiwiZXh0ZW5zaW9uIiwiZXh0bmFtZSIsIm5hbWUiLCJmaWxlbmFtZSIsInVwbG9hZERpciIsImpvaW4iLCJwcm9jZXNzIiwiY3dkIiwicmVjdXJzaXZlIiwiZXJyb3IiLCJmaWxlcGF0aCIsImZpbGVVcmwiLCJ1cmwiLCJjb25zb2xlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/upload/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fupload%2Froute&page=%2Fapi%2Fupload%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fupload%2Froute.ts&appDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fupload%2Froute&page=%2Fapi%2Fupload%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fupload%2Froute.ts&appDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_peloro_Desktop_Condominio_online_store_project_final_online_store_project_app_api_upload_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/upload/route.ts */ \"(rsc)/./app/api/upload/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/upload/route\",\n        pathname: \"/api/upload\",\n        filename: \"route\",\n        bundlePath: \"app/api/upload/route\"\n    },\n    resolvedPagePath: \"/home/peloro/Desktop/Condominio/online_store_project/final_online_store_project/app/api/upload/route.ts\",\n    nextConfigOutput,\n    userland: _home_peloro_Desktop_Condominio_online_store_project_final_online_store_project_app_api_upload_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZ1cGxvYWQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnVwbG9hZCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnVwbG9hZCUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGcGVsb3JvJTJGRGVza3RvcCUyRkNvbmRvbWluaW8lMkZvbmxpbmVfc3RvcmVfcHJvamVjdCUyRmZpbmFsX29ubGluZV9zdG9yZV9wcm9qZWN0JTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZob21lJTJGcGVsb3JvJTJGRGVza3RvcCUyRkNvbmRvbWluaW8lMkZvbmxpbmVfc3RvcmVfcHJvamVjdCUyRmZpbmFsX29ubGluZV9zdG9yZV9wcm9qZWN0JmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUN1RDtBQUNwSTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL2hvbWUvcGVsb3JvL0Rlc2t0b3AvQ29uZG9taW5pby9vbmxpbmVfc3RvcmVfcHJvamVjdC9maW5hbF9vbmxpbmVfc3RvcmVfcHJvamVjdC9hcHAvYXBpL3VwbG9hZC9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvdXBsb2FkL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvdXBsb2FkXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS91cGxvYWQvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvaG9tZS9wZWxvcm8vRGVza3RvcC9Db25kb21pbmlvL29ubGluZV9zdG9yZV9wcm9qZWN0L2ZpbmFsX29ubGluZV9zdG9yZV9wcm9qZWN0L2FwcC9hcGkvdXBsb2FkL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fupload%2Froute&page=%2Fapi%2Fupload%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fupload%2Froute.ts&appDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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

/***/ "fs/promises":
/*!******************************!*\
  !*** external "fs/promises" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("fs/promises");

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

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fupload%2Froute&page=%2Fapi%2Fupload%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fupload%2Froute.ts&appDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();