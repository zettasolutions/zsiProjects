

CREATE PROCEDURE [dbo].[drivers_pao_upd]
(
    @tt    drivers_pao_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET
			 company_id			= b.company_id	
			,first_name			= b.first_name	
	   	    ,last_name			= b.last_name	
			,middle_name		= b.middle_name
			,name_suffix		= b.name_suffix
			,hash_key			= b.hash_key
			,position			= b.position
			,transfer_type_id	= b.transfer_type_id
			,bank_id			= b.bank_id
			,transfer_no			= b.transfer_no
			,role_id			= b.role_id
			,is_active			= b.is_active		
	   	    ,updated_by			= @user_id
			,updated_date		= GETDATE()
       FROM dbo.users a INNER JOIN @tt b
	     ON a.user_id = b.user_id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO users(
		 company_id
        ,first_name
		,last_name
		,middle_name
		,name_suffix
		,hash_key
		,position
		,transfer_type_id
		,bank_id
		,transfer_no
		,role_id
		,is_active
		,created_by
		,created_date
    )
	SELECT 
		 company_id
		,first_name
		,last_name
		,middle_name
		,name_suffix
		,newid()
		,position
		,transfer_type_id
		,bank_id
		,transfer_no
		,role_id
		,is_active	
	    ,@user_id
	    ,GETDATE()
	FROM @tt 
	WHERE user_id IS NULL
	AND ISNULL(first_name,'') <>''
	AND ISNULL(last_name,'') <>''
	AND ISNULL(role_id,0) <>0
	AND ISNULL(company_id,0) <>0

