import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription name is required"],
        unique: true,
        trim: true, 
        minLength: 2,
        maxLength: 100,

    },
    price: {
        type: Number,
        required: [true, "Subscription price is required"],
        min: [0, "Price must be greater than )"]
    },
    currency: {
        type: String,
        enum: ["USD", "EUR", "UGX"],
        default: "USD"
    },
    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"]
    }, 
    category: {
        type: String,
        enum: ["sports", "entertainment", "lifestyle", "technology", "politics", "others"],
        required: true
    }, 
    payment: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["active", "canceled", "expired"],
        default: "active"
    }, 
    startDate: {
        type: Date,
        required: true,
        validate: {
          validator: () => new Date(),
          message: "Start date must be in the past", 
        }
    },
    renewalDate: {
        type: Date,
        required: true,
        validate: {
          validator: function () {
            return this.startDate();
          },
          message: "Renewal date must be after the start date", 
        }
    }, 
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        index: true,
    }
}, {timestamps: true});

// Auto calculate the renewal date if not provided
subscriptionSchema.pre("save", function (next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        };
        
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }
    // Auto update renewal date if provided
    if (this.renewalDate < new Date()) {
        this.status = "expired";
    }
    next();
});


const Subscription = mongoose.model("Subscription", subscriptionSchema);


export default Subscription;
