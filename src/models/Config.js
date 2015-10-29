import mongoose from 'mongoose';

export default mongoose.model('Config', {
    refresh_token: String
});
