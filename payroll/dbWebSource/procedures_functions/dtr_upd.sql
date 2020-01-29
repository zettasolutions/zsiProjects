CREATE PROCEDURE [dbo].[dtr_upd]
(
    @tt    dtr_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	      employee_id				= b.employee_id			
			 ,shift_id					= b.shift_id	
			 ,shift_hours				= b.shift_hours	
			 ,dtr_date					= b.dtr_date		
			 ,dt_in						= b.dt_in				
			 ,dt_out					= b.dt_out		
	 		 ,reg_hours					= b.reg_hours				
			 ,nd_hours					= b.nd_hours				
			 ,odt_in					= b.odt_in
			 ,odt_out					= b.odt_out
			 ,reg_ot_hrs				= b.reg_ot_hrs
			 ,nd_ot_hours				= b.nd_ot_hours
			 ,rd_ot_hours				= b.rd_ot_hours
			 ,rhd_ot_hours				= b.rhd_ot_hours
			 ,shd_ot_hours				= b.shd_ot_hours
			 ,leave_type_id				= b.leave_type_id
			 ,leave_hours				= b.leave_hours
			 ,leave_hours_wpay			= b.leave_hours_wpay
			 	   	     
       FROM dbo.dtr a INNER JOIN @tt b
	     ON a.id = b.id
	     WHERE (
			isnull(b.is_edited,'')  <> ''
		);
-- Insert Process
	INSERT INTO dtr (
         employee_id	
		,shift_id	
		,shift_hours	
		,dtr_date
	    ,dt_in					
	    ,dt_out		
	    ,reg_hours			
	    ,nd_hours	
		,odt_in
		,odt_out	
		,reg_ot_hrs
		,nd_ot_hours
		,rd_ot_hours
		,rhd_ot_hours
		,shd_ot_hours
		,leave_type_id
		,leave_hours
		,leave_hours_wpay
			
    )
	SELECT 
         employee_id	
		,shift_id	
		,shift_hours	
		,dtr_date
	    ,dt_in					
	    ,dt_out		
	    ,reg_hours			
	    ,nd_hours	
		,odt_in
		,odt_out	
		,reg_ot_hrs
		,nd_ot_hours
		,rd_ot_hours
		,rhd_ot_hours
		,shd_ot_hours
		,leave_type_id
		,leave_hours
		,leave_hours_wpay
	FROM @tt 
	WHERE id IS NULL
		  AND employee_id IS NOT NULL
		  AND shift_id IS NOT NULL	
		  AND shift_hours IS NOT NULL
		  AND dtr_date IS NOT NULL	
		  AND dt_in	IS NOT NULL				
		  AND dt_out IS NOT NULL;	

