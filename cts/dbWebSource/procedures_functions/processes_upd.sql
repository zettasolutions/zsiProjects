
CREATE PROCEDURE [dbo].[processes_upd]
(
    @tt    processes_tt READONLY
   ,@user_id int
)
AS

BEGIN
DECLARE @client_id int
SELECT @client_id=client_id FROM dbo.users where user_id=@user_id;
-- Update Process
    UPDATE a 
    SET  process_title		    = b.process_title
		,process_desc		    = b.process_desc
		,seq_no  			    = b.seq_no
		,icon					= b.icon
		,category_id            = b.category_id
		,type_id                = b.type_id
		,is_active              = b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.processes a INNER JOIN @tt b
    ON a.process_id = b.process_id
    WHERE isnull(b.is_edited,'N') = 'Y' ;

	   
-- Insert Process
    INSERT INTO dbo.processes (
         process_title 
		,process_desc
		,seq_no  
		,icon
		,category_id
		,type_id
		,client_id
		,is_active  
        ,created_by
        ,created_date
        )
    SELECT 
         process_title 
		,process_desc
		,seq_no
		,icon  
		,category_id
		,type_id
		,@client_id
		,is_active  
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE process_id IS NULL
	and process_title IS NOT NULL;
END




