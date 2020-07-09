
CREATE PROCEDURE [dbo].[dd_users_sel]  
(  
   @user_id int = NULL

)  
AS  
BEGIN  

SELECT user_id, userFullName  FROM dbo.users_v where user_id = @user_id;
 
END;  
