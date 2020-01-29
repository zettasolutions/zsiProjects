

CREATE PROCEDURE [dbo].[positions_upd]
(
    @tt    positions_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	      position_title	= b.position_title
			 ,position_desc		= b.position_desc	   
			 ,work_desc			= b.work_desc  
			 ,level_no          = b.level_no
			 ,basic_pay			= b.basic_pay	   
			 ,hourly_rate		= b.hourly_rate  
			 ,daily_rate        = b.daily_rate
			 ,updated_by        = @user_id
			 ,updated_date      = GETDATE()
       FROM dbo.positions a INNER JOIN @tt b
	     ON a.position_id = b.position_id 
	    AND (isnull(is_edited,'N')='Y')

-- Insert Process
	INSERT INTO positions (
         position_title
		,position_desc	
		,work_desc		
		,level_no
		,created_by
		,created_date
		,basic_pay	
		,hourly_rate
		,daily_rate 
    )
	SELECT 
		 position_title
		,position_desc	
		,work_desc	
		,level_no
		,@user_id
		,GETDATE()	
		,basic_pay	
		,hourly_rate
		,daily_rate 
	FROM @tt 
	WHERE position_id IS NULL
      AND position_title IS NOT NULL;




