

CREATE PROCEDURE [dbo].[statuses_upd]
(
    @tt    statuses_tt READONLY
   ,@user_id int
)
AS

BEGIN
SET NOCOUNT ON
DECLARE @client_id int
SELECT @client_id=client_id FROM dbo.users where user_id=@user_id;
-- Update Process
    UPDATE a 
    SET  seq_no					= b.seq_no
		,status_code		    = b.status_code
		,status_name			= b.status_name
		,status_color  			= b.status_color
		,icon                   = b.icon
		,is_active				= b.is_active
		,is_edit                = b.is_edit
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.statuses a INNER JOIN @tt b
    ON a.status_id = b.status_id
    WHERE isnull(b.is_edited,'N') = 'Y' ;

	   
-- Insert Process
    INSERT INTO dbo.statuses (
         seq_no
		,status_code 
		,status_name
		,status_color   
		,icon
		,client_id
	    ,is_active
		,is_edit 
        ,created_by
        ,created_date
        )
    SELECT 
		seq_no
       ,status_code 
	   ,status_name	
	   ,status_color
	   ,icon
	   ,@client_id
	   ,is_active
	   ,is_edit  
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE status_id IS NULL
	and status_name IS NOT NULL;
END





