

CREATE PROCEDURE [dbo].[item_status_upd]
(
    @tt    item_status_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    INSERT INTO dbo.item_audits (item_id, remaining_time, status_id, created_by, created_date)
	SELECT item_id, remaining_time, status_id, @user_id, getDate() FROM @tt WHERE ISNULL(is_edited,'N')='Y'

    UPDATE a 
    SET  remaining_time		    = b.remaining_time
		,status_id				= b.status_id			
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.items a INNER JOIN @tt b
    ON a.item_id = b.item_id
    WHERE ISNULL(b.is_edited,'N')='Y';
  
END



 




