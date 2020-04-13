CREATE PROCEDURE [dbo].[dum_clients_upd]
(
    @tt clients_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 	   	     
			 client_code				= b.client_code
			,client_name				= b.client_name
			,client_phone_no			= b.client_phone_no
			,client_mobile_no			= b.client_mobile_no
			,client_email_add			= b.client_email_add 
			,is_active					= b.is_active 
			,billing_address			= b.billing_address 
			,created_by					= @user_id
			,created_date	 			= GETDATE()
	   	    ,updated_by					= @user_id
			,updated_date				= GETDATE()

       FROM dbo.clients a INNER JOIN @tt b
	     ON a.client_id = b.client_id
	     
-- Insert Process
	INSERT INTO clients (         
			 client_code		
			,client_name		
			,client_phone_no	
			,client_mobile_no	
			,client_email_add	
			,is_active			
			,billing_address	 	 
			,created_by		 
			,created_date				 					 
			,updated_by
			,updated_date
    )
	SELECT          
			  client_code		
			,client_name		
			,client_phone_no	
			,client_mobile_no	
			,client_email_add	
			,is_active			
			,billing_address		 
			,@user_id
			,GETDATE()						 		
			,@user_id
			,GETDATE()

	FROM @tt 

	WHERE client_id IS NULL
	AND client_code IS NOT NULL
	AND client_name IS NOT NULL





