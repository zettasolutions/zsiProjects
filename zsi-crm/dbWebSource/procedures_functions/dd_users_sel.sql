
CREATE PROCEDURE [dbo].[dd_users_sel]  
(  
   @user_id int = NULL
)  
AS  
BEGIN  

SELECT user_id, userFullName  FROM dbo.users_v where 1=1;
 
END;  
