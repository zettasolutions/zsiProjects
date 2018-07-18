

create PROCEDURE [dbo].[role_processes_upd]
(
    @tt    role_processes_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- DELETE
   DELETE FROM dbo.role_processes WHERE role_process_id IN (select role_process_id FROM @tt WHERE is_deleted='Y')
-- Update Process Statuses
    UPDATE a 
    SET  process_id		    = b.process_id
		,role_id		    = b.role_id
        ,updated_by			= @user_id
        ,updated_date		= GETDATE()
    FROM dbo.role_processes a INNER JOIN @tt b
    ON a.role_process_id = b.role_process_id
    WHERE isnull(b.is_edited,'N') = 'Y'
	AND b.process_id IS NOT NULL AND b.role_id IS NOT NULL ;

	   
-- Insert Process
    INSERT INTO dbo.role_processes (
         process_id 
		,role_id
        ,created_by
        ,created_date
        )
    SELECT 
         process_id 
		,role_id
        ,@user_id
        ,GETDATE()
    FROM @tt
    WHERE role_process_id IS NULL
	and process_id IS NOT NULL and role_id IS NOT NULL;
END





