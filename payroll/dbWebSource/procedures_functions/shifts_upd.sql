CREATE PROCEDURE [dbo].[shifts_upd]
(
    @tt    shifts_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET 
	   	      shift_code				= b.shift_code
			 ,shift_title				= b.shift_title
			 ,monday					= b.monday				
			 ,tuesday					= b.tuesday			
			 ,wednesday					= b.wednesday	
	 		 ,thursday					= b.thursday			
			 ,friday					= b.friday				
			 ,saturday					= b.saturday				
			 ,sunday					= b.sunday
			 ,no_hours					= b.no_hours			 
			 ,from_time_in				= b.from_time_in
			 ,to_time_in				= b.to_time_in	   	     
       FROM dbo.shifts a INNER JOIN @tt b
	     ON a.shift_id = b.shift_id
	     WHERE ISNULL(b.shift_code,'') <> '' AND isnull(b.is_edited,'') <> '';
-- Insert Process
	INSERT INTO shifts (
         shift_code	
		,shift_title
		,monday				
		,tuesday		
		,wednesday		
		,thursday			
		,friday	
		,saturday
		,sunday		
		,no_hours					
		,from_time_in	
		,to_time_in	
	)
	SELECT 
		 shift_code	
		,shift_title
		,monday					
		,tuesday		
		,wednesday		
		,thursday			
		,friday
		,saturday
		,sunday			
		,no_hours		
		,from_time_in	
		,to_time_in	

	FROM @tt 
	WHERE shift_id IS NULL
	AND ISNULL(shift_code,'') <> ''

