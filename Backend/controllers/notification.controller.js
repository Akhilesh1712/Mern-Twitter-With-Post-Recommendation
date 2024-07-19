import Notification from "../models/notification.js";

export const getNotification = async (req,res) => {// matlab notification dhek na
        try {
            const userId = req.user._id;
            const notification = await Notification.find({to:userId}).populate({
                path: "from",
                select: "username profileImg"
            });

            await Notification.updateMany({to:userId}, {read: true});

            res.status(200).json(notification);
        } catch (error) {
            return res.status(500).json({error:`${error}`});
        }
}

export const deleteNotification = async (req,res) => {
 
      try {
        const userId = req.user._id;

        await Notification.deleteMany({to:userId});// delete those who send to us
        res.status(200).json({message: "Notifications deleted"});
      } catch (error) {
        return res.status(500).json({error: `${error}`});
        
      }

}

export const deleteOneparticular = async (req,res) =>{
    try {
        const {id} = req.params;
        const userId = req.user._id;
        const notification = await Notification.findById(id);
        if(!notification){
            return res.status(404).json({error: "Notifaication not found in it"});
        }
        if(notification.toString() !== userId.toString()){
            return res.status(403).json({error: "You are not allowed to delete this notification"});
        }
        await Notification.findByIdAndDelete(notification);
        res.status(200).json({message: "Notification deleted succesfully in it"});
    } catch (error) {
        return res.status(500).json({error: `${error}`});
        
    }
}