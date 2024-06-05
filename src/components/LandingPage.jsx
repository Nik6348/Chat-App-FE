import * as React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = React.useState(false);

  const springProps = useSpring({
    scale: isHovered ? 1.1 : 1,
    config: { mass: 1, friction: 20, tension: 170 },
  });

  function AnimatedBubbles() {
    const group = React.useRef();
    const sphereCount = 10;

    useFrame(() => {
      if (group.current) {
        group.current.rotation.y += 0.005;
      }
    });

    return (
      <group ref={group}>
        {[...Array(sphereCount)].map((_, index) => (
          <animated.mesh
            key={index}
            position={[
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 8,
            ]}
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
          >
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshBasicMaterial color={isHovered ? 'lightgreen' : 'lightblue'} />
          </animated.mesh>
        ))}
      </group>
    );
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      {/* 3D Animated Area */}
      <Canvas style={{ height: '40vh' }} camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <AnimatedBubbles />
      </Canvas>

      {/* Content and Button */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          Secure Chat App
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Your privacy, our priority.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ backgroundColor: '#2196f3' }}
          onClick={() => navigate('/signup')}
        >
          Start Chat
        </Button>
      </Box>
    </Box>
  );
}

export default LandingPage;
