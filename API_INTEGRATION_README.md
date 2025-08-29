# Albany Ledger Officials API Integration

## 🚀 **Overview**

The Albany Ledger admin panel has been updated to integrate with the backend API endpoints for officials management. This integration provides real-time data persistence while maintaining backward compatibility with mock data.

## 🔧 **Configuration**

### Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://albany-ledger-ac0ae29a7839.herokuapp.com
NEXT_PUBLIC_USE_OFFICIALS_API=true

# Supabase Configuration (if using Supabase auth)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Feature Flags
NEXT_PUBLIC_ENABLE_VOTING_HISTORY=false
NEXT_PUBLIC_ENABLE_IMAGE_UPLOADS=true
```

### API Toggle

- **`NEXT_PUBLIC_USE_OFFICIALS_API=true`**: Uses real API endpoints
- **`NEXT_PUBLIC_USE_OFFICIALS_API=false`**: Falls back to mock data (default)

## 📡 **API Endpoints**

The integration supports all endpoints from the Postman collection:

### **Officials Management**
- `GET /api/officials` - List all officials with filtering
- `GET /api/officials/{id}` - Get specific official
- `POST /api/officials` - Create new official
- `PUT /api/officials/{id}` - Update official
- `DELETE /api/officials/{id}` - Delete official
- `POST /api/officials/{id}/image` - Upload official image

### **Committees Management**
- `GET /api/committees` - List all committees
- `GET /api/committees/{id}` - Get specific committee
- `POST /api/committees` - Create new committee
- `PUT /api/committees/{id}` - Update committee
- `DELETE /api/committees/{id}` - Delete committee

### **Public Endpoints (No Auth)**
- `GET /api/public/officials` - Public officials list
- `GET /api/public/officials/{id}` - Public official details
- `GET /api/public/committees` - Public committees list

## 🔄 **Migration Features**

### **Backward Compatibility**
- All existing functions (`getOfficials`, `getOfficialById`, etc.) now support async operations
- Automatic fallback to mock data if API calls fail
- No breaking changes to existing components

### **Data Transformation**
- Automatic transformation between API format and frontend format
- Handles differences in field names and structure
- Preserves all existing functionality

## 🎯 **Updated Components**

### **Officials List Page** (`app/officials/page.tsx`)
- ✅ Async data loading with loading states
- ✅ Error handling with toast notifications
- ✅ Automatic refresh after operations
- ✅ Search and filtering support

### **Official Form** (`components/OfficialForm.tsx`)
- ✅ Async create/update operations
- ✅ Loading states during submission
- ✅ Success/error notifications
- ✅ Form validation

### **Official Profile Page** (`app/officials/[id]/page.tsx`)
- ✅ Async data loading
- ✅ Loading states
- ✅ Error handling

## 🔐 **Authentication**

The integration uses Supabase JWT tokens for authentication:

```typescript
// Automatic token handling in api-client.ts
const token = await getAuthToken()
// Returns session?.access_token from Supabase
```

## 📊 **Error Handling**

### **Graceful Degradation**
- API failures automatically fall back to mock data
- Console warnings for debugging
- User-friendly error messages

### **Toast Notifications**
- Success messages for successful operations
- Error messages with retry suggestions
- Loading indicators during operations

## 🧪 **Testing**

### **API Testing**
Use the provided Postman collection to test endpoints:

1. Import the Postman collection
2. Set environment variables:
   - `base_url`: Your API base URL
   - `supabase_jwt`: Valid JWT token
3. Test all endpoints

### **Frontend Testing**
1. Set `NEXT_PUBLIC_USE_OFFICIALS_API=true`
2. Ensure valid authentication
3. Test all CRUD operations
4. Verify error handling

## 🚨 **Troubleshooting**

### **Common Issues**

1. **API Not Responding**
   - Check `NEXT_PUBLIC_API_BASE_URL`
   - Verify network connectivity
   - Check API server status

2. **Authentication Errors**
   - Verify Supabase configuration
   - Check JWT token validity
   - Ensure user is logged in

3. **Data Not Loading**
   - Check browser console for errors
   - Verify API endpoint responses
   - Check environment variables

### **Debug Mode**
Enable debug logging by adding to `.env.local`:
```bash
NEXT_PUBLIC_DEBUG_API=true
```

## 📈 **Performance**

### **Optimizations**
- Automatic caching of API responses
- Debounced search operations
- Optimistic UI updates
- Efficient data transformation

### **Monitoring**
- API call timing in browser dev tools
- Network tab for request/response analysis
- Console logging for debugging

## 🔮 **Future Enhancements**

### **Planned Features**
- [ ] Real-time updates with WebSocket
- [ ] Offline support with service workers
- [ ] Advanced caching strategies
- [ ] Bulk operations
- [ ] Image upload optimization

### **Voting History Integration**
When ready to implement voting history:
1. Set `NEXT_PUBLIC_ENABLE_VOTING_HISTORY=true`
2. Uncomment voting history sections
3. Implement voting history API endpoints
4. Add voting history management UI

## 📚 **API Documentation**

For complete API documentation, refer to:
- [Backend Integration Guide](./OFFICIALS_BACKEND_INTEGRATION.md)
- [Postman Collection](./postman_collection.json)
- [API Client Documentation](./lib/officials-api.ts)

## 🤝 **Support**

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify API endpoint responses
4. Test with Postman collection
5. Check environment configuration

---

**Status**: ✅ **Ready for Production**

The API integration is complete and ready for use. All existing functionality is preserved while adding real-time data persistence capabilities.
