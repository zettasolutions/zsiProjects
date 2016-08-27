
CREATE PROCEDURE [dbo].[position_upd]
(
    @tt    position_tt READONLY
   ,@user_id int
)
AS

BEGIN/*
-- Update Process
    UPDATE a 
        SET 
			 position_name			  = b.position_name
			,job_description		  = b.job_description
			,is_active				  = b.is_active
            ,updated_by				  = @user_id
            ,updated_date			  = GETDATE()
     FROM dbo.employee a INNER JOIN @tt b
        ON a.employee_id = b.employee_id 
       WHERE (
			
			OR	isnull(a.position_name,'')				 <> isnull(b.position_name,'')   
			OR	isnull(a.job_description,'')			 <> isnull(b.job_description,'')      
			OR	isnull(a.is_active,'')					 <> isnull(b.is_active,'')
	   )
	   */
-- Insert Process

    INSERT INTO position (
       
		
		 position_name			
		,job_description	
		,is_active	
		,created_by
        ,created_date
        )

    SELECT 
       
		 position_name	
		,job_description	
		,is_active	
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE position_id IS NULL
END






